using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using CommonUtil.Core.Service;
using IDMS.Service.GqlTypes;

namespace IDMS.Residue.GqlTypes
{
    [ExtendObjectType(typeof(ServiceMutation))]
    public class ResidueMutation
    {
        public async Task<int> AddResidue(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
           [Service] IConfiguration config, residue residue)
        {
            try
            {
                if (residue == null)
                    throw new GraphQLException(new Error($"Residue object cannot be null", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                residue newResidue = residue;
                newResidue.guid = Util.GenerateGUID();
                newResidue.create_by = user;
                newResidue.create_dt = currentDateTime;
                newResidue.status_cv = CurrentServiceStatus.PENDING;
                await context.residue.AddAsync(newResidue);

                //Handling For Template_est_part
                IList<residue_part> partList = new List<residue_part>();
                foreach (var newPart in residue.residue_part)
                {
                    newPart.guid = Util.GenerateGUID();
                    newPart.create_by = user;
                    newPart.create_dt = currentDateTime;
                    newPart.residue_guid = newResidue.guid;
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

        public async Task<int> UpdateResidue(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IConfiguration config, residue residue)
        {
            try
            {
                if (residue == null)
                    throw new GraphQLException(new Error($"Residue object cannot be null for update", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var updatedResidue = new residue() { guid = residue.guid };
                context.residue.Attach(updatedResidue);

                updatedResidue.update_by = user;
                updatedResidue.update_dt = currentDateTime;
                updatedResidue.job_no = residue.job_no;
                updatedResidue.bill_to_guid = residue.bill_to_guid;
                updatedResidue.remarks = residue.remarks;
         
                //Handling For Template_est_part
                foreach (var item in residue.residue_part)
                {
                    if (ObjectAction.NEW.EqualsIgnore(item.action))
                    {
                        item.guid = Util.GenerateGUID();
                        item.create_by = user;
                        item.create_dt = currentDateTime;
                        item.residue_guid = residue.guid;
                        await context.residue_part.AddAsync(item);
                    }
                    else if (ObjectAction.EDIT.EqualsIgnore(item.action))
                    {
                        if (string.IsNullOrEmpty(item.guid))
                            throw new GraphQLException(new Error($"Residue part guid cannot be null or empty for update", "ERROR"));

                        var part = new residue_part() { guid = item.guid };
                        context.residue_part.Attach(part);

                        part.update_by = user;
                        part.update_dt = currentDateTime;
                        part.quantity = item.quantity;
                        part.cost = item.cost;
                        part.description = item.description;
                        part.tariff_residue_guid = item.tariff_residue_guid;
                    }
                    else if (ObjectAction.CANCEL.EqualsIgnore(item.action))
                    {
                        var part = new residue_part() { guid = item.guid };
                        context.residue_part.Attach(part);
                        part.update_by = user;
                        part.update_dt = currentDateTime;
                        part.delete_dt = currentDateTime;
                    }
                }
            
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

        public async Task<int> ApproveResidue(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
                [Service] IConfiguration config, residue residue)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                //Handlind update approval for estimate
                if (residue != null && !string.IsNullOrEmpty(residue.guid) && !string.IsNullOrEmpty(residue.bill_to_guid))
                {
                    var approveResidue = new residue() { guid = residue.guid };
                    context.residue.Attach(approveResidue);

                    approveResidue.bill_to_guid = residue.bill_to_guid;
                    approveResidue.update_by = user;
                    approveResidue.update_dt = currentDateTime;
                    approveResidue.status_cv = CurrentServiceStatus.APPROVED;
                    approveResidue.job_no = residue.job_no;
                    approveResidue.remarks = residue.remarks;
                    approveResidue.approve_by = user;
                    approveResidue.approve_dt = currentDateTime;

                    if (residue.residue_part != null)
                    {
                        foreach (var item in residue.residue_part)
                        {
                            var part = new residue_part() { guid = item.guid };
                            context.residue_part.Attach(part);

                            part.approve_part = item.approve_part;
                            part.cost = item.cost;
                            part.quantity = item.quantity;
                            part.update_by = user;
                            part.update_dt = currentDateTime;
                        }
                    }
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> CancelResidue(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IConfiguration config, List<residue> residue)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var delResidue in residue)
                {
                    if (delResidue != null && !string.IsNullOrEmpty(delResidue.guid))
                    {
                        var resd = new residue() { guid = delResidue.guid };
                        context.Attach(resd);

                        resd.update_by = user;
                        resd.update_dt = currentDateTime;
                        resd.status_cv = CurrentServiceStatus.CANCELED;
                        resd.remarks = delResidue.remarks;
                    }
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
