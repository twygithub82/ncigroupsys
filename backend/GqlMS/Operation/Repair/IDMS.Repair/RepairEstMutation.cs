using HotChocolate;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Master;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using CommonUtil.Core.Service;
using IDMS.Models.Service;
using static IDMS.Repair.GqlTypes.StatusConstant;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ValueGeneration;
using IDMS.Repair.GqlTypes.LocalModel;

namespace IDMS.Repair.GqlTypes
{
    public class RepairEstMutation
    {
        public async Task<int> AddRepairEstimate(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, repair_est RepairEstimate, customer_company? customerCompany)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var repEstimate = new repair_est();
                repEstimate.guid = Util.GenerateGUID();
                repEstimate.create_by = user;
                repEstimate.create_dt = currentDateTime;

                repEstimate.sot_guid = RepairEstimate.sot_guid;
                repEstimate.aspnetusers_guid = RepairEstimate.aspnetusers_guid;
                repEstimate.estimate_no = RepairEstimate.estimate_no;
                repEstimate.labour_cost_discount = RepairEstimate.labour_cost_discount;
                repEstimate.material_cost_discount = RepairEstimate.material_cost_discount;
                repEstimate.total_cost = RepairEstimate.total_cost;
                repEstimate.labour_cost = RepairEstimate.labour_cost;
                repEstimate.owner_enable = RepairEstimate.owner_enable;
                repEstimate.remarks = RepairEstimate.remarks;
                repEstimate.status_cv = RepairEstStatus.PENDING;
                await context.repair_est.AddAsync(repEstimate);

                //Handling For Template_est_part
                IList<repair_est_part> partList = new List<repair_est_part>();
                foreach (var newPart in RepairEstimate.repair_est_part)
                {
                    newPart.guid = Util.GenerateGUID();
                    newPart.create_by = user;
                    newPart.create_dt = currentDateTime;
                    newPart.repair_est_guid = repEstimate.guid;
                    partList.Add(newPart);

                    await UpdateRepairDamageCode(context, user, currentDateTime, newPart);
                }
                await context.repair_est_part.AddRangeAsync(partList);


                //Handlind For Customer Default Template
                if (customerCompany != null && customerCompany.guid != "")
                {
                    var cust = new customer_company() { guid = customerCompany.guid };
                    context.Attach(cust);

                    cust.def_template_guid = customerCompany.def_template_guid;
                    cust.update_by = user;
                    cust.update_dt = currentDateTime;
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


        public async Task<int> UpdateRepairEstimate(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, repair_est RepairEstimate, customer_company? customerCompany)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (string.IsNullOrEmpty(RepairEstimate.guid))
                    throw new GraphQLException(new Error($"Template_estimate guid used for update cannot be null or empty", "ERROR"));

                //var repTemplate = new repair_est() { guid = RepairEstimate.guid };
                //context.Attach(repTemplate);

                var repTemplate = await context.repair_est.Where(t => t.guid == RepairEstimate.guid && (t.delete_dt == null || t.delete_dt == 0))
                                                          .Include(t => t.repair_est_part)
                                                            .ThenInclude(tp => tp.rep_damage_repair)
                                                          .FirstOrDefaultAsync();

                if (repTemplate == null)
                    throw new GraphQLException(new Error($"Repair_estimate not found", "ERROR"));

                repTemplate.update_by = user;
                repTemplate.update_dt = currentDateTime;
                repTemplate.sot_guid = RepairEstimate.sot_guid;
                repTemplate.aspnetusers_guid = RepairEstimate.aspnetusers_guid;
                repTemplate.labour_cost_discount = RepairEstimate.labour_cost_discount;
                repTemplate.material_cost_discount = RepairEstimate.material_cost_discount;
                repTemplate.total_cost = RepairEstimate.total_cost;
                repTemplate.labour_cost = RepairEstimate.labour_cost;
                repTemplate.estimate_no = RepairEstimate.estimate_no;
                repTemplate.remarks = RepairEstimate.remarks;

                if (RepairEstimate.repair_est_part != null)
                {
                    foreach (var part in RepairEstimate.repair_est_part)
                    {
                        if (ObjectAction.NEW.EqualsIgnore(part.action))
                        {
                            var newRepairPart = part;
                            newRepairPart.guid = Util.GenerateGUID();
                            newRepairPart.create_by = user;
                            newRepairPart.create_dt = currentDateTime;
                            newRepairPart.repair_est_guid = repTemplate.guid;
                            await UpdateRepairDamageCode(context, user, currentDateTime, part);
                            await context.repair_est_part.AddAsync(newRepairPart);
                            continue;
                        }


                        var existingPart = repTemplate.repair_est_part?.Where(p => p.guid == part.guid && (p.delete_dt == null || p.delete_dt == 0)).FirstOrDefault();
                        if (existingPart == null)
                            throw new GraphQLException(new Error($"Repair_est_part guid used for update cannot be null or empty", "ERROR"));

                        if (ObjectAction.EDIT.EqualsIgnore(part.action))
                        {
                            //var existingPart = new repair_est_part() { guid = part.guid };
                            //context.Attach(existingPart);
                            existingPart.update_by = user;
                            existingPart.update_dt = currentDateTime;
                            existingPart.description = part.description;
                            existingPart.comment = part.comment;
                            existingPart.owner = part.owner;
                            existingPart.quantity = part.quantity;
                            existingPart.location_cv = part.location_cv;
                            existingPart.hour = part.hour;
                            existingPart.material_cost = part.material_cost;
                            existingPart.remarks = part.remarks;
                            await UpdateRepairDamageCode(context, user, currentDateTime, part, part.rep_damage_repair);
                            continue;
                        }

                        if (ObjectAction.CANCEL.EqualsIgnore(part.action))
                        {
                            //var existingPart = new repair_est_part() { guid = part.guid };
                            //context.Attach(existingPart);

                            existingPart.delete_dt = currentDateTime;
                            existingPart.update_dt = currentDateTime;
                            existingPart.update_by = user;
                            await UpdateRepairDamageCode(context, user, currentDateTime, part, part.rep_damage_repair);
                            continue;
                        }
                    }
                }

                //Handlind For Customer Default Template
                if (customerCompany != null && customerCompany.guid != "")
                {
                    var cust = new customer_company() { guid = customerCompany.guid };
                    context.Attach(cust);

                    cust.def_template_guid = customerCompany.def_template_guid;
                    cust.update_by = user;
                    cust.update_dt = currentDateTime;
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


        public async Task<int> CancelRepairEstimate(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
                [Service] IConfiguration config, List<repair_est> RepairEstimate)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var estRepair in RepairEstimate)
                {
                    if (estRepair != null && !string.IsNullOrEmpty(estRepair.guid))
                    {
                        var est = new repair_est() { guid = estRepair.guid };
                        context.Attach(est);

                        est.update_by = user;
                        est.update_dt = currentDateTime;
                        est.status_cv = RepairEstStatus.CANCEL;
                        est.remarks = estRepair.remarks;
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


        public async Task<int> RollbackRepairEstimate(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
                [Service] IConfiguration config, List<RepairEstimateRequest> RepairEstimate)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var estRepair in RepairEstimate)
                {
                    if (estRepair != null && !string.IsNullOrEmpty(estRepair.guid))
                    {
                        var est = new repair_est() { guid = estRepair.guid };
                        context.Attach(est);

                        est.update_by = user;
                        est.update_dt = currentDateTime;
                        est.status_cv = RepairEstStatus.PENDING;
                        est.remarks = estRepair.remarks;

                        if (string.IsNullOrEmpty(estRepair.customer_guid))
                            throw new GraphQLException(new Error($"Customer company guid cannot be null or empty", "ERROR"));

                        var customerGuid = estRepair.customer_guid;
                        var repairEstPart = context.repair_est_part.Where(r => r.repair_est_guid == estRepair.guid).ToList();
                        var estPartGuid = repairEstPart.Select(x => x.tariff_repair_guid).ToArray();
                        //var estPartGuid = estRepair.repair_est_part.Select(x => x.tariff_repair_guid).ToArray();
                        var packageRepair = context.package_repair.Where(r => estPartGuid.Contains(r.guid) &&
                                            r.customer_company_guid == customerGuid).ToList();

                        foreach (var part in repairEstPart)
                        {
                            var estPart = new repair_est_part() { guid = part.guid };
                            context.Attach(estPart);

                            estPart.update_by = user;
                            estPart.update_dt = currentDateTime;
                            estPart.material_cost = packageRepair.Where(r => r.tariff_repair_guid == part.tariff_repair_guid).Select(r => r.material_cost).First();
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

        public async Task<int> ApproveRepairEstimate(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, repair_est RepairEstimate)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                //Handlind update approval for estimate
                if (RepairEstimate != null && !string.IsNullOrEmpty(RepairEstimate.guid) && !string.IsNullOrEmpty(RepairEstimate.bill_to_guid))
                {
                    var est = new repair_est() { guid = RepairEstimate.guid };
                    context.Attach(est);

                    est.bill_to_guid = RepairEstimate.bill_to_guid;
                    est.update_by = user;
                    est.update_dt = currentDateTime;
                    est.status_cv = RepairEstStatus.APPROVED;
                    est.remarks = RepairEstimate.remarks;
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }


        private async Task UpdateRepairDamageCode(ApplicationServiceDBContext context, string user, long currentDateTime,
                                          repair_est_part estPart, IEnumerable<rep_damage_repair>? repDamageRepair = null)
        {
            try
            {
                if (estPart.rep_damage_repair != null)
                {
                    foreach (var item in estPart.rep_damage_repair)
                    {

                        //if (string.IsNullOrEmpty(item.action) && !string.IsNullOrEmpty(item.guid))
                        //   throw new GraphQLException(new Error($"Tep_damage_repair action cannot be null for update", "ERROR"));

                        if (string.IsNullOrEmpty(item.action))
                            continue;

                        if (string.IsNullOrEmpty(item.guid) && (ObjectAction.NEW.EqualsIgnore(item.action) || string.IsNullOrEmpty(item.action)))
                        {
                            var repDamage = item;//new tep_damage_repair();
                            repDamage.guid = Util.GenerateGUID();
                            repDamage.create_by = user;
                            repDamage.create_dt = currentDateTime;

                            repDamage.rep_guid = estPart.guid;
                            repDamage.code_type = item.code_type;
                            repDamage.code_cv = item.code_cv;
                            await context.rep_damage_repair.AddAsync(repDamage);
                            continue;
                        }

                        if (ObjectAction.EDIT.EqualsIgnore(item.action))
                        {
                            if (string.IsNullOrEmpty(item.guid))
                                throw new GraphQLException(new Error($"Rep_damage_repair guid cannot null or empty for update", "ERROR"));

                            var repDamage = repDamageRepair?.Where(t => t.guid == item.guid).FirstOrDefault();
                            //var repDamage = new rep_damage_repair() { guid = item.guid };
                            //context.Attach(repDamage);
                            if (repDamage != null)
                            {
                                repDamage.update_dt = currentDateTime;
                                repDamage.update_by = user;
                                repDamage.code_cv = item.code_cv;
                                repDamage.code_type = item.code_type;
                                //await context.AddAsync(tepDamage)
                            }
                            continue;
                        }

                        if (ObjectAction.CANCEL.EqualsIgnore(item.action))
                        {
                            if (string.IsNullOrEmpty(item.guid))
                                throw new GraphQLException(new Error($"Rep_damage_repair guid cannot null or empty for cancel", "ERROR"));

                            //var repDamage = new rep_damage_repair() { guid = item.guid };
                            //context.Attach(repDamage);
                            var repDamage = repDamageRepair?.Where(t => t.guid == item.guid).FirstOrDefault();
                            if (repDamage != null)
                            {
                                repDamage.delete_dt = currentDateTime;
                                repDamage.update_by = user;
                                repDamage.update_dt = currentDateTime;
                            }
                            continue;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }


    }
}
