using CommonUtil.Core.Service;
using HotChocolate.Authorization;
using IDMS.Models;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace IDMS.InGate.GqlTypes
{
    public class InGate_MutationType
    {
       //[Authorize]
        public async Task<int> AddInGate([Service] ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor,in_gate InGate)
        {
            int retval = 0;   
            try
            {
                
                //long epochNow = GqlUtils.GetNowEpochInSec();
                var uid=GqlUtils.IsAuthorize(config,httpContextAccessor);
                InGate.guid = (string.IsNullOrEmpty(InGate.guid) ? Util.GenerateGUID() : InGate.guid);
                InGate.create_by = uid;
                InGate.create_dt = GqlUtils.GetNowEpochInSec();
                EntityClass_InGateWithTank newInGate = new() { 
                      create_by =InGate.create_by,
                      create_dt = InGate.create_dt,
                      driver_name =InGate.driver_name,
                      eir_doc =InGate.eir_doc,
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

                if(so.haulier!=InGate.haulier)
                {
                    so.haulier = InGate.haulier;
                }

                context.in_gate.Add(newInGate);

                retval = context.SaveChanges();
                
               
            }
            catch
            {
                throw;
            }
            return retval;
        }

        //[Authorize]
        public async Task<int> UpdateInGate([Service] ApplicationInventoryDBContext context,[Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, EntityClass_InGateWithTank InGate)
        {
            int retval = 0;
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
                    }

                    context.in_gate.Update(InGate);
                    retval= context.SaveChanges();
                   // retval = InGate;
                }
          
            }
            catch
            {
                throw;
            }
            return retval;
        }

        public async Task<int> DeleteInGate([Service] ApplicationInventoryDBContext context, [Service] IConfiguration config, 
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
    