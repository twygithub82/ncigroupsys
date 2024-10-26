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
           [Service] IConfiguration config, residue residueQuote)
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
                residueQuote.status_cv = CurrentServiceStatus.PENDING;
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
        [Service] IConfiguration config, residue residueQuote)
        {
            try
            {
                if (residueQuote == null)
                    throw new GraphQLException(new Error($"Residue object cannot be null for update", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var updatedResidue = new residue() { guid = residueQuote.guid };
                context.residue.Attach(updatedResidue);

                updatedResidue.update_by = user;
                updatedResidue.update_dt = currentDateTime;
                updatedResidue.job_no = residueQuote.job_no;
                updatedResidue.bill_to_guid = residueQuote.bill_to_guid;
                updatedResidue.remarks = residueQuote.remarks;
         
                //Handling For Template_est_part
                foreach (var item in residueQuote.residue_part)
                {
                    if (ObjectAction.NEW.EqualsIgnore(item.action))
                    {
                        item.guid = Util.GenerateGUID();
                        item.create_by = user;
                        item.create_dt = currentDateTime;
                        item.residue_guid = residueQuote.guid;
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

        public async Task<int> ApproveResidueQuotation(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
                [Service] IConfiguration config, residue residueQuote)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                //Handlind update approval for estimate
                if (residueQuote != null && !string.IsNullOrEmpty(residueQuote.guid) && !string.IsNullOrEmpty(residueQuote.bill_to_guid))
                {
                    var approveResidue = new residue() { guid = residueQuote.guid };
                    context.residue.Attach(approveResidue);

                    approveResidue.bill_to_guid = residueQuote.bill_to_guid;
                    approveResidue.update_by = user;
                    approveResidue.update_dt = currentDateTime;
                    approveResidue.status_cv = CurrentServiceStatus.APPROVED;
                    approveResidue.job_no = residueQuote.job_no;
                    approveResidue.remarks = residueQuote.remarks;
                    approveResidue.approve_by = user;
                    approveResidue.approve_dt = currentDateTime;

                    if (residueQuote.residue_part != null)
                    {
                        foreach (var item in residueQuote.residue_part)
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

        public async Task<int> CancelResidueQuotation(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IConfiguration config, List<residue> residueQuote)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var delResidue in residueQuote)
                {
                    if (delResidue != null && !string.IsNullOrEmpty(delResidue.guid))
                    {
                        var resd = new residue() { guid = delResidue.guid };
                        context.Attach(resd);

                        resd.update_by = user;
                        resd.update_dt = currentDateTime;
                        resd.status_cv = CurrentServiceStatus.CANCEL;
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
