using CommonUtil.Core.Service;
using HotChocolate.Data;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter.CleaningGroup.GqlTypes
{
    public class CleanningGroup_MutationType
    {
       
        public async Task<int> AddCleaningGroup([Service] ApplicationParameterDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, EntityClass_CleaningGroupWithCleanProcedure NewCleanGroup)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewCleanGroup.guid = (string.IsNullOrEmpty(NewCleanGroup.guid) ? Util.GenerateGUID() : NewCleanGroup.guid);
                var newcGroup = new EntityClass_CleaningGroupWithCleanProcedure();
                newcGroup.guid = NewCleanGroup.guid;
                newcGroup.description = NewCleanGroup.description;
                newcGroup.group_name = NewCleanGroup.group_name;
                newcGroup.minimum_cost = NewCleanGroup.minimum_cost;
                newcGroup.maximum_cost = NewCleanGroup.maximum_cost;
                newcGroup.category= NewCleanGroup.category;
                newcGroup.create_by = uid;
                newcGroup.create_dt = GqlUtils.GetNowEpochInSec();
                context.cleaning_group.Add(newcGroup);

                if (NewCleanGroup.clean_procedures != null)
                {
                    var procedures = context.cleaning_procedure.Where(i => i.delete_dt == null).AsEnumerable().Where(p => NewCleanGroup.clean_procedures.Any(s=>s.guid==p.guid));
                    foreach (var proc in procedures)
                    {

                        if (!string.IsNullOrEmpty(proc.clean_group_guid))
                        {
                            throw new GraphQLException(new Error("The cleaning procedure has been assigned to another cleanning group", "401"));
                        }

                        proc.clean_group_guid = newcGroup.guid;
                        proc.update_by = uid;
                        proc.update_dt= GqlUtils.GetNowEpochInSec();
                    }
                }
                retval=context.SaveChanges();
              
             
            }
            catch { throw; }

            
            return retval;
        }

      
        public async Task<int> UpdateCleaningGroup([Service] ApplicationParameterDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, EntityClass_CleaningGroupWithCleanProcedure UpdateCleanGroup)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateCleanGroup.guid;
                var dbCleanGroup = context.cleaning_group.Find(guid);
                if(dbCleanGroup == null)
                {
                    throw new GraphQLException(new Error("The Cleaning Group not found", "500"));
                }
                dbCleanGroup.description = UpdateCleanGroup.description;
                dbCleanGroup.minimum_cost = UpdateCleanGroup.minimum_cost;
                dbCleanGroup.maximum_cost = UpdateCleanGroup.maximum_cost;
                dbCleanGroup.category = UpdateCleanGroup.category;
                dbCleanGroup.group_name = UpdateCleanGroup.group_name;
                dbCleanGroup.update_by = uid;
                dbCleanGroup.update_dt = GqlUtils.GetNowEpochInSec();
                var updCleanProcedures = UpdateCleanGroup.clean_procedures;
                if (updCleanProcedures != null)
                {
                    // extract update existing Clean procedure under the cleaning group from db 
                    var dbCleanProcedures = context.cleaning_procedure.Where(p => p.clean_group_guid == guid);
                    foreach (var dbCleanPR in dbCleanProcedures)
                    {
                        dbCleanPR.clean_group_guid = null;
                        dbCleanPR.update_by = uid;
                        dbCleanPR.update_dt = GqlUtils.GetNowEpochInSec();
                    }

                    var dbUpdCleanProcedures = context.cleaning_procedure.AsEnumerable().Where(p => updCleanProcedures.Any(s => s.guid == p.guid));
                    foreach (var dbUpdCleanPR in dbUpdCleanProcedures)
                    {
                        dbUpdCleanPR.clean_group_guid = guid;
                        dbUpdCleanPR.update_by = uid;
                        dbUpdCleanPR.update_dt = GqlUtils.GetNowEpochInSec();
                    }
                }
                retval = context.SaveChanges();
                //// InsertSteps(context, uid, guid, updSteps);
                // retval = context.SaveChanges();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> DeleteCleaningGroup([Service] ApplicationParameterDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteCleanGroup_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delCleanGroups = context.cleaning_group.Where(s => DeleteCleanGroup_guids.Contains(s.guid) && s.delete_dt == null);
                var delCleanProcedures = context.cleaning_procedure.Where(s => DeleteCleanGroup_guids.Contains(s.clean_group_guid) && s.delete_dt == null);

                foreach (var dCleanGroup in delCleanGroups)
                {
                    dCleanGroup.delete_dt = GqlUtils.GetNowEpochInSec();
                    dCleanGroup.update_by = uid;
                    dCleanGroup.update_dt = GqlUtils.GetNowEpochInSec();
                }

                foreach (var delCleanProcedure in delCleanProcedures)
                {
                    delCleanProcedure.clean_group_guid = null;
                    delCleanProcedure.update_by = uid;
                    delCleanProcedure.update_dt = GqlUtils.GetNowEpochInSec();
                }
                retval = context.SaveChanges();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }
    }

}
