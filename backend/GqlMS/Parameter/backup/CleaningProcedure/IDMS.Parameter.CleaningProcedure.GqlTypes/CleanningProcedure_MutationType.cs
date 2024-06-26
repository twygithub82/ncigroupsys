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

namespace IDMS.Models.Parameter.CleaningProcedure.GqlTypes
{
    public class CleanningProcedure_MutationType
    {
       
        public async Task<int> AddCleaningProcedure([Service] ApplicationParameterDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, EntityClass_CleaningProcedure_Mutation NewCleanProcedureSteps)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewCleanProcedureSteps.guid = (string.IsNullOrEmpty(NewCleanProcedureSteps.guid) ? Util.GenerateGUID() : NewCleanProcedureSteps.guid);
                var newCleanProcedure = new EntityClass_CleaningProcedureWithSteps();
                newCleanProcedure.guid = NewCleanProcedureSteps.guid;
                newCleanProcedure.description = NewCleanProcedureSteps.description;
                newCleanProcedure.clean_group_guid = NewCleanProcedureSteps.clean_group_guid;
                newCleanProcedure.category= NewCleanProcedureSteps.category;
                newCleanProcedure.procedure_name = NewCleanProcedureSteps.procedure_name;
                newCleanProcedure.create_by = uid;
                newCleanProcedure.create_dt = GqlUtils.GetNowEpochInSec();
                context.cleaning_procedure.Add(newCleanProcedure);
                InsertSteps(context,uid,newCleanProcedure.guid,NewCleanProcedureSteps.clean_steps);
                //foreach (var step in NewCleanProcedureSteps.clean_steps)
                //{
                //    var newProduceStep = new EntityClass_CleaningProcedureSteps() { 
                //      cleaning_step_guid =step.guid,
                //       create_by =uid,
                //        create_dt =GqlUtils.GetNowEpochInSec(),
                //         guid =  Util.GenerateGUID(),
                //          cleaning_procedure_guid= newCleanProcedure.guid

                //    };
                //    context.cleaning_procedure_steps.Add(newProduceStep);

                //    var updStep = await context.cleaning_steps.FindAsync(step.guid);
                //    if(updStep == null)
                //    {
                //        throw new GraphQLException(new Error("The Cleaning Step not found", "500"));
                //    }

                //    if(updStep.duration!=step.duration)
                //    {
                //        updStep.duration = step.duration;
                //        updStep.update_by = uid;
                //        updStep.update_dt = GqlUtils.GetNowEpochInSec();
                //        //context.cleaning_steps.Update(updStep);

                //    }
                //}
              retval=context.SaveChanges();
            }
            catch { throw; }

            
            return retval;
        }

        private void InsertSteps(ApplicationParameterDBContext context, string uid,string cleaning_procedure_guid, IEnumerable<EntityClass_CleaningStep> InsertSteps )
        {
            try
            {
                foreach (var step in InsertSteps)
                {
                    var newProduceStep = new EntityClass_CleaningProcedureSteps()
                    {
                        cleaning_step_guid = step.guid,
                        create_by = uid,
                        create_dt = GqlUtils.GetNowEpochInSec(),
                        guid = Util.GenerateGUID(),
                        cleaning_procedure_guid = cleaning_procedure_guid

                    };
                    context.cleaning_procedure_steps.Add(newProduceStep);

                    var updStep =  context.cleaning_steps.Find(step.guid);
                    if (updStep == null)
                    {
                        throw new GraphQLException(new Error("The Cleaning Step not found", "500"));
                    }

                    if (updStep.duration != step.duration)
                    {
                        updStep.duration = step.duration;
                        updStep.update_by = uid;
                        updStep.update_dt = GqlUtils.GetNowEpochInSec();
                  
                    }
                    
                }
            }
            catch
            { throw; }
        }
        public async Task<int> UpdateCleaningProcedure([Service] ApplicationParameterDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, EntityClass_CleaningProcedure_Mutation UpdateCleanProcedure)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateCleanProcedure.guid;
                var dbCleanProcedure = context.cleaning_procedure.Find(guid);
                if(dbCleanProcedure == null)
                {
                    throw new GraphQLException(new Error("The Cleaning Procedure not found", "500"));
                }
                dbCleanProcedure.description = UpdateCleanProcedure.description;
                dbCleanProcedure.clean_group_guid = UpdateCleanProcedure.clean_group_guid;
                dbCleanProcedure.category = UpdateCleanProcedure.category;
                dbCleanProcedure.procedure_name = UpdateCleanProcedure.procedure_name;
                dbCleanProcedure.update_by = uid;
                dbCleanProcedure.update_dt = GqlUtils.GetNowEpochInSec();
                var updSteps = UpdateCleanProcedure.clean_steps;
                var dbSteps = context.cleaning_procedure_steps.Where(s => s.cleaning_procedure_guid == guid);
                foreach(var dbStep in dbSteps)
                {
                    dbStep.delete_dt=GqlUtils.GetNowEpochInSec();
                    dbStep.update_by=uid;
                    dbStep.update_dt = GqlUtils.GetNowEpochInSec();
                }

                InsertSteps(context, uid, guid, updSteps);
                retval = context.SaveChanges();
             
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> DeleteCleaningProcedures([Service] ApplicationParameterDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteCleanProcedure_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delCleanProcedures = context.cleaning_procedure.Where(s => DeleteCleanProcedure_guids.Contains(s.guid) && s.delete_dt == null);
                var delCleanProcedureSteps = context.cleaning_procedure_steps.Where(s => DeleteCleanProcedure_guids.Contains(s.cleaning_procedure_guid) && s.delete_dt == null);
                foreach (var dCleanProcedure in delCleanProcedures)
                {
                    dCleanProcedure.delete_dt=GqlUtils.GetNowEpochInSec();
                    dCleanProcedure.update_by = uid;
                    dCleanProcedure.update_dt= GqlUtils.GetNowEpochInSec();
                }

                foreach(var dCleanProcedureStep in delCleanProcedureSteps)
                {
                    dCleanProcedureStep.delete_dt = GqlUtils.GetNowEpochInSec();
                    dCleanProcedureStep.update_by = uid;
                    dCleanProcedureStep.update_dt = GqlUtils.GetNowEpochInSec();
                }
                retval=context.SaveChanges();
                
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
