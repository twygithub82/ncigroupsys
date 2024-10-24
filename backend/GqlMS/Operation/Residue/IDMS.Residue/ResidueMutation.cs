using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using IDMS.Repair;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using IDMS.Repair.GqlTypes;
using IDMS.Models.Master;
using Microsoft.Extensions.Configuration;
using CommonUtil.Core.Service;
using static IDMS.Repair.GqlTypes.StatusConstant;

namespace IDMS.Residue.GqlTypes
{
    [ExtendObjectType(typeof(RepairEstMutation))]
    public class ResidueMutation
    {
        public async Task<int> AddResidueQuotation(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
           [Service] IConfiguration config, residue residueQuote, customer_company? customerCompany)
        {
            try
            {
                if (residueQuote == null)
                    throw new GraphQLException(new Error($"Residue object cannot be null", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                residueQuote.guid = Util.GenerateGUID();
                residueQuote.create_by = user;
                residueQuote.create_dt = currentDateTime;
                await context.residue.AddAsync(residueQuote);

                //Handling For Template_est_part
                IList<residue_part> partList = new List<residue_part>();
                foreach (var newPart in residueQuote.residue_part)
                {
                    newPart.guid = Util.GenerateGUID();
                    newPart.create_by = user;
                    newPart.create_dt = currentDateTime;
                    newPart.residue_guid = residueQuote.guid;
                    partList.Add(newPart);
                }
                await context.residue_part.AddRangeAsync(partList);


                var res = await context.SaveChangesAsync();
                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateResidueQuotation(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IConfiguration config, residue residueQuote, customer_company? customerCompany)
        {
            try
            {
                if (residueQuote == null)
                    throw new GraphQLException(new Error($"Residue object cannot be null", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                residueQuote.guid = Util.GenerateGUID();
                residueQuote.create_by = user;
                residueQuote.create_dt = currentDateTime;
                await context.residue.AddAsync(residueQuote);

                //Handling For Template_est_part
                IList<residue_part> partList = new List<residue_part>();
                foreach (var newPart in residueQuote.residue_part)
                {
                    newPart.guid = Util.GenerateGUID();
                    newPart.create_by = user;
                    newPart.create_dt = currentDateTime;
                    newPart.residue_guid = residueQuote.guid;
                    partList.Add(newPart);
                }
                await context.residue_part.AddRangeAsync(partList);


                var res = await context.SaveChangesAsync();
                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> ApproveRepairEstimate(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
                [Service] IConfiguration config, residue residueQuote)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                //Handlind update approval for estimate
                if (residueQuote != null && !string.IsNullOrEmpty(residueQuote.guid) && !string.IsNullOrEmpty(residueQuote.bill_to_guid))
                {
                    var est = new repair_est() { guid = residueQuote.guid };
                    context.repair_est.Attach(est);

                    est.bill_to_guid = residueQuote.bill_to_guid;
                    est.update_by = user;
                    est.update_dt = currentDateTime;
                    est.status_cv = RepairEstStatus.APPROVED;
                    est.remarks = residueQuote.remarks;

                    //if (residueQuote.residue_part != null)
                    //{
                    //    foreach (var item in residueQuote.residue_part)
                    //    {
                    //        var part = new repair_est_part() { guid = item.guid };
                    //        context.repair_est_part.Attach(part);

                    //        part.approve_qty = item.approve_qty;
                    //        part.approve_hour = item.approve_hour;
                    //        part.approve_part = item.approve_part;
                    //        part.approve_cost = item.approve_cost;
                    //        part.update_by = user;
                    //        part.update_dt = currentDateTime;
                    //    }
                    //}
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
