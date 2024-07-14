using CommonUtil.Core.Service;
using HotChocolate.Authorization;
using IDMS.InGateSurvey.Model.Request;
using IDMS.Models;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Data.SqlTypes;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace IDMS.InGateSurvey.GqlTypes
{
    public class IGSurveyMutation
    {
       //[Authorize]
        public async Task<int> AddInGateSurvey([Service] ApplicationInventoryDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, InGateSurveyRequest inGateSurvey)
        {
            int retval = 0;   
            try
            {
                string so_guid = "";
                //long epochNow = GqlUtils.GetNowEpochInSec();
                var uid=GqlUtils.IsAuthorize(config,httpContextAccessor);
                InGate.guid = (string.IsNullOrEmpty(InGate.guid) ? Util.GenerateGUID() : InGate.guid);
                InGate.create_by = uid;
                InGate.create_dt = GqlUtils.GetNowEpochInSec();
                InGateWithTank newInGate = new() { 
                      create_by =InGate.create_by,
                      create_dt = InGate.create_dt,
                      driver_name =InGate.driver_name,
                      //eir_doc =InGate.eir_doc,
                      eir_date =InGate.eir_date,
                      eir_no =InGate.eir_no,
                      guid =InGate.guid,
                   //   haulier =InGate.haulier,
                      lolo_cv   = InGate.lolo_cv, 
                      preinspection_cv =InGate.preinspection_cv,
                      so_tank_guid =InGate.so_tank_guid,
                      vehicle_no =InGate.vehicle_no,
                      yard_cv   =InGate.yard_cv,
                      
                };
                
                
                var so_tank = context.storing_order_tank.Where(sot=> sot.guid ==InGate.so_tank_guid).Include(so=>so.storing_order).FirstOrDefault();

                if (so_tank == null)
                {
                    throw new GraphQLException(new Error("Tank not found", "404"));
                }

                var so = so_tank.storing_order;
                if (so == null)
                {
                    throw new GraphQLException(new Error("Storing Order not found", "404"));
                }

                if (so.haulier != InGate.haulier)
                {
                    so.haulier = InGate.haulier;
                    so.update_by = uid;
                    so.update_dt=GqlUtils.GetNowEpochInSec();
                }

                if (InGate.tank != null)
                {
                    if(so_tank.status_cv!="WAITING")
                    {
                        throw new GraphQLException(new Error("Tank status is not waiting", "404"));
                    }
                    so_tank.job_no = InGate.tank.job_no;
                    so_tank.status_cv = "ACCEPTED";
                 //   so_tank.purpose_cleaning = InGate.tank.purpose_cleaning;
                 //   so_tank.purpose_steam= InGate.tank.purpose_steam;
                    so_tank.purpose_storage=InGate.tank.purpose_storage;
                    so_tank.update_by = uid;
                    so_tank.update_dt=GqlUtils.GetNowEpochInSec();
                    so_guid = so_tank.so_guid;
                }
                newInGate.eir_no = $"{so.so_no}";
                //if(so.haulier!=InGate.haulier)
                //{
                //    so.haulier = InGate.haulier;
                //}

                context.in_gate.Add(newInGate);

               
                if (!string.IsNullOrEmpty(so_guid))
                {
                    CheckAndUpdateSOStatus(context, so_guid);
                }

                retval = context.SaveChanges();
            }
            catch
            {
                throw;
            }
            return retval;
        }

        //[Authorize]
        public async Task<int> UpdateInGateSurvey([Service] ApplicationInventoryDBContext context,[Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, InGateWithTank InGate)
        {
            int retval = 0;
            string so_guid = "";
            try
            {
                if (InGate != null)
                {
                    long epochNow = GqlUtils.GetNowEpochInSec();
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    InGate.update_by = uid;
                    InGate.update_dt=epochNow;
                    
                    var so_tank = context.storing_order_tank.Where(sot => sot.guid == InGate.so_tank_guid).Include(so => so.storing_order).FirstOrDefault();

                    if (so_tank == null)
                    {
                        throw new GraphQLException(new Error("Tank not found", "404"));
                    }

                    var so = so_tank.storing_order;
                    
                    if (so == null)
                    {
                        throw new GraphQLException(new Error("Storing Order not found", "404"));
                    }

                    if (so.haulier != InGate.haulier)
                    {
                        so.haulier = InGate.haulier;
                        so.update_by = uid;
                        so.update_dt = GqlUtils.GetNowEpochInSec();
                    }

                    if(InGate.tank!=null)
                    {
                        so_tank.job_no= InGate.tank.job_no;
                        so_tank.status_cv="ACCEPTED";
                        //so_tank.purpose_cleaning = InGate.tank.purpose_cleaning;
                      //  so_tank.purpose_steam = InGate.tank.purpose_steam;
                        so_tank.purpose_storage = InGate.tank.purpose_storage;
                        so_tank.update_by = uid;
                        so_tank.update_dt = GqlUtils.GetNowEpochInSec();
                        so_guid = so_tank.so_guid;
                    }

                    context.in_gate.Update(InGate);
                   

                    if (!string.IsNullOrEmpty(so_guid))
                    {
                        CheckAndUpdateSOStatus(context, so_guid);
                    }

                    retval = context.SaveChanges();
                    // retval = InGate;
                }
          
            }
            catch
            {
                throw;
            }
            return retval;
        }

        public async Task<int> DeleteInGateSurvey([Service] ApplicationInventoryDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, string InGate_guid)
        {
            int retval =0;
            try
            {

                var uid=GqlUtils.IsAuthorize(config, httpContextAccessor);
                var query = context.in_gate.Where(i=>i.guid==$"{InGate_guid}");
                if(query.Any())
                {
                    long epochNow = GqlUtils.GetNowEpochInSec();
                    var delInGate= query.FirstOrDefault();
                    delInGate.delete_dt = epochNow;
                    delInGate.update_by=uid;
                    delInGate.update_dt=epochNow;
                
                    retval = context.SaveChanges(true);
                }

                //long epochNow = GqlUtils.GetNowEpochInSec();
                //var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //var guid = Util.GenerateGUID();
                //var delNow = GqlUtils.GetNowEpochInSec();
                //var command = @$"update in_gate set delete_dt={delNow},update_by='{uid}',update_dt={delNow}  where guid='{InGate_guid}' ";
                ////var command = @$"Insert into in_gate (guid,so_tank_guid,eir_no,vehicle_no,yard_guid,driver_name,LOLO,preinspection,create_dt)
                ////            values ('{InGate.guid}','{InGate.so_tank_guid}','{InGate.eir_no}','{InGate.vehicle_no}','{InGate.yard_guid}','{InGate.driver_name}',
                ////            '{InGate.LOLO}','{InGate.preinspection}',{epochNow})";

                //var result = await GqlUtils.RunNonQueryCommand(config, command);
                //if (result["result"] != null)
                //{
                //    retval.result = Convert.ToInt32(result["result"]);
                //}
            }
            catch
            {
                throw;
            }
            return retval;
        }
    }
}
    