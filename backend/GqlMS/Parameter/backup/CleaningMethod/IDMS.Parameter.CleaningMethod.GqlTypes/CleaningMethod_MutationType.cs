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

namespace IDMS.Models.Parameter.CleaningMethod.GqlTypes
{
    public class CleanningMethod_MutationType
    {
       
        public async Task<int> AddCleaningMethod([Service] ApplicationParameterDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, EntityClass_CleaningMethod NewCleanMethod)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewCleanMethod.guid = (string.IsNullOrEmpty(NewCleanMethod.guid) ? Util.GenerateGUID() : NewCleanMethod.guid);
                var newCleanMthd = new EntityClass_CleaningMethod();
                newCleanMthd.guid = NewCleanMethod.guid;
                newCleanMthd.description = NewCleanMethod.description;
                newCleanMthd.cost  = NewCleanMethod.cost;
                newCleanMthd.cleaning_group_cv= NewCleanMethod.cleaning_group_cv;
                newCleanMthd.name = NewCleanMethod.name;
                newCleanMthd.create_by = uid;
                newCleanMthd.create_dt = GqlUtils.GetNowEpochInSec();
                context.cleaning_method.Add(newCleanMthd);
              retval=context.SaveChanges();
            }
            catch { throw; }

            
            return retval;
        }

       
        public async Task<int> UpdateCleaningMethod([Service] ApplicationParameterDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, EntityClass_CleaningMethod UpdateCleanMethod)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateCleanMethod.guid;
                var dbCleanMethod = context.cleaning_method.Find(guid);
                if(dbCleanMethod == null)
                {
                    throw new GraphQLException(new Error("The Cleaning Procedure not found", "500"));
                }
                dbCleanMethod.description = UpdateCleanMethod.description;
                dbCleanMethod.cost = UpdateCleanMethod.cost;
                dbCleanMethod.cleaning_group_cv = UpdateCleanMethod.cleaning_group_cv;
                dbCleanMethod.name = UpdateCleanMethod.name;
                dbCleanMethod.update_by = uid;
                dbCleanMethod.update_dt = GqlUtils.GetNowEpochInSec();
               
                retval = context.SaveChanges();
             
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> DeleteCleaningMethod([Service] ApplicationParameterDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteCleanMethod_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delCleanMethods = context.cleaning_method.Where(s => DeleteCleanMethod_guids.Contains(s.guid) && s.delete_dt == null);
              

                foreach(var delCleanMethod in delCleanMethods)
                {
                    delCleanMethod.delete_dt = GqlUtils.GetNowEpochInSec();
                    delCleanMethod.update_by = uid;
                    delCleanMethod.update_dt = GqlUtils.GetNowEpochInSec();
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
