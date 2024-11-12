using HotChocolate;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Master;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using CommonUtil.Core.Service;
using IDMS.Models.Service;
using Microsoft.EntityFrameworkCore;
using IDMS.Repair.GqlTypes.LocalModel;
using HotChocolate.Types;
using IDMS.Service.GqlTypes;

namespace IDMS.Repair.GqlTypes
{
    [ExtendObjectType(typeof(ServiceMutation))]
    public class RepairMutation
    {
        public async Task<int> AddRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, repair repair, customer_company? customerCompany)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var newRepair = new repair();
                newRepair.guid = Util.GenerateGUID();
                newRepair.create_by = user;
                newRepair.create_dt = currentDateTime;

                newRepair.sot_guid = repair.sot_guid;
                newRepair.aspnetusers_guid = repair.aspnetusers_guid;
                newRepair.estimate_no = repair.estimate_no;
                newRepair.labour_cost_discount = repair.labour_cost_discount;
                newRepair.material_cost_discount = repair.material_cost_discount;
                newRepair.total_cost = repair.total_cost;
                newRepair.labour_cost = repair.labour_cost;
                newRepair.owner_enable = repair.owner_enable;
                newRepair.remarks = repair.remarks;
                newRepair.total_hour = repair.total_hour;
                newRepair.job_no = repair.job_no;
                newRepair.status_cv = CurrentServiceStatus.PENDING;
                await context.repair.AddAsync(newRepair);

                //Handling For Template_est_part
                IList<repair_part> partList = new List<repair_part>();
                foreach (var newPart in repair.repair_part)
                {
                    newPart.guid = Util.GenerateGUID();
                    newPart.create_by = user;
                    newPart.create_dt = currentDateTime;
                    newPart.repair_guid = newRepair.guid;
                    partList.Add(newPart);

                    await UpdateRepairDamageCode(context, user, currentDateTime, newPart);
                }
                await context.repair_part.AddRangeAsync(partList);


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

        public async Task<int> ApproveRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, repair repair)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                //Handlind update approval for estimate
                if (repair != null && !string.IsNullOrEmpty(repair.guid) && !string.IsNullOrEmpty(repair.bill_to_guid))
                {
                    var appvRepair = new repair() { guid = repair.guid };
                    context.repair.Attach(appvRepair);

                    appvRepair.update_by = user;
                    appvRepair.update_dt = currentDateTime;

                    appvRepair.total_cost = repair.total_cost;
                    appvRepair.bill_to_guid = repair.bill_to_guid;
                    appvRepair.remarks = repair.remarks;

                    if (CurrentServiceStatus.PENDING.EqualsIgnore(repair.status_cv))
                        appvRepair.status_cv = CurrentServiceStatus.APPROVED;
      
                    if (repair.repair_part != null)
                    {
                        foreach (var item in repair.repair_part)
                        {
                            var part = new repair_part() { guid = item.guid };
                            context.repair_part.Attach(part);

                            part.approve_qty = item.approve_qty;
                            part.approve_hour = item.approve_hour;
                            part.approve_part = item.approve_part;
                            part.approve_cost = item.approve_cost;
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

        public async Task<int> UpdateRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, repair repair, customer_company? customerCompany)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (string.IsNullOrEmpty(repair.guid))
                    throw new GraphQLException(new Error($"Repair guid used for update cannot be null or empty", "ERROR"));

                var updateRepair = await context.repair.Where(t => t.guid == repair.guid && (t.delete_dt == null || t.delete_dt == 0))
                                                          .Include(t => t.repair_part)
                                                            .ThenInclude(tp => tp.rp_damage_repair)
                                                          .FirstOrDefaultAsync();

                if (updateRepair == null)
                    throw new GraphQLException(new Error($"Repair not found", "ERROR"));

                updateRepair.update_by = user;
                updateRepair.update_dt = currentDateTime;
                updateRepair.sot_guid = repair.sot_guid;
                updateRepair.aspnetusers_guid = repair.aspnetusers_guid;
                updateRepair.labour_cost_discount = repair.labour_cost_discount;
                updateRepair.material_cost_discount = repair.material_cost_discount;
                updateRepair.total_cost = repair.total_cost;
                updateRepair.labour_cost = repair.labour_cost;
                updateRepair.estimate_no = repair.estimate_no;
                updateRepair.remarks = repair.remarks;
                updateRepair.total_hour = repair.total_hour;
                updateRepair.job_no = repair.job_no;

                if (repair.repair_part != null)
                {
                    foreach (var part in repair.repair_part)
                    {
                        if (ObjectAction.NEW.EqualsIgnore(part.action))
                        {
                            var newRepairPart = part;
                            newRepairPart.guid = Util.GenerateGUID();
                            newRepairPart.create_by = user;
                            newRepairPart.create_dt = currentDateTime;
                            newRepairPart.repair_guid = updateRepair.guid;
                            await UpdateRepairDamageCode(context, user, currentDateTime, part);
                            await context.repair_part.AddAsync(newRepairPart);
                            continue;
                        }


                        var existingPart = updateRepair.repair_part?.Where(p => p.guid == part.guid && (p.delete_dt == null || p.delete_dt == 0)).FirstOrDefault();
                        if (existingPart == null)
                            throw new GraphQLException(new Error($"Repair_part guid used for update cannot be null or empty", "ERROR"));

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
                            //await UpdateRepairDamageCode(context, user, currentDateTime, part, part.rep_damage_repair);
                            await UpdateRepairDamageCode(context, user, currentDateTime, part, existingPart.rp_damage_repair);
                            continue;
                        }

                        if (ObjectAction.CANCEL.EqualsIgnore(part.action))
                        {
                            //var existingPart = new repair_est_part() { guid = part.guid };
                            //context.Attach(existingPart);

                            existingPart.delete_dt = currentDateTime;
                            existingPart.update_dt = currentDateTime;
                            existingPart.update_by = user;
                            //await UpdateRepairDamageCode(context, user, currentDateTime, part, part.rep_damage_repair);
                            await UpdateRepairDamageCode(context, user, currentDateTime, part, existingPart.rp_damage_repair);
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

        public async Task<int> CancelRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
                [Service] IConfiguration config, List<repair> repair)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var item in repair)
                {
                    if (item != null && !string.IsNullOrEmpty(item.guid))
                    {
                        var cancelRepair = new repair() { guid = item.guid };
                        context.Attach(cancelRepair);

                        cancelRepair.update_by = user;
                        cancelRepair.update_dt = currentDateTime;
                        cancelRepair.status_cv = CurrentServiceStatus.CANCELED;
                        cancelRepair.remarks = item.remarks;
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

        public async Task<int> RollbackRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
                [Service] IConfiguration config, List<RepairRequest> repair)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var item in repair)
                {
                    if (item != null && !string.IsNullOrEmpty(item.guid))
                    {
                        var rollbackRepair = new repair() { guid = item.guid };
                        context.repair.Attach(rollbackRepair);

                        rollbackRepair.update_by = user;
                        rollbackRepair.update_dt = currentDateTime;
                        rollbackRepair.status_cv = CurrentServiceStatus.PENDING;
                        rollbackRepair.remarks = item.remarks;

                        if (string.IsNullOrEmpty(item.customer_guid))
                            throw new GraphQLException(new Error($"Customer company guid cannot be null or empty", "ERROR"));

                        var customerGuid = item.customer_guid;
                        var repairPart = await context.repair_part.Where(r => r.repair_guid == item.guid && (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();
                        var partsTarifRepairGuids = repairPart.Select(x => x.tariff_repair_guid).ToArray();
                        //var estPartGuid = estRepair.repair_est_part.Select(x => x.tariff_repair_guid).ToArray();
                        var packageRepair = await context.package_repair.Where(r => partsTarifRepairGuids.Contains(r.tariff_repair_guid) &&
                                            r.customer_company_guid == customerGuid && (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();

                        foreach (var part in repairPart)
                        {
                            //var estPart = new repair_est_part() { guid = part.guid };
                            //context.repair_est_part.Attach(estPart);
                            part.update_by = user;
                            part.update_dt = currentDateTime;
                            part.material_cost = packageRepair.Where(r => r.tariff_repair_guid == part.tariff_repair_guid).Select(r => r.material_cost).First();
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

        public async Task<int> RollbackRepairApproval(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
               [Service] IConfiguration config, List<RepairRequest> repair)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var item in repair)
                {
                    if (item != null && !string.IsNullOrEmpty(item.guid))
                    {
                        var rollbackRepair = new repair() { guid = item.guid };
                        context.repair.Attach(rollbackRepair);

                        rollbackRepair.update_by = user;
                        rollbackRepair.update_dt = currentDateTime;
                        rollbackRepair.status_cv = CurrentServiceStatus.PENDING;
                        rollbackRepair.remarks = item.remarks;

                        if (string.IsNullOrEmpty(item.customer_guid))
                            throw new GraphQLException(new Error($"Customer company guid cannot be null or empty", "ERROR"));

                        var customerGuid = item.customer_guid;
                        var repairPart = await context.repair_part.Where(r => r.repair_guid == item.guid && (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();

                        foreach (var part in repairPart)
                        {
                            part.update_by = user;
                            part.update_dt = currentDateTime;
                            part.approve_part = null;
                            part.approve_cost = part.material_cost;
                            part.approve_hour = part.hour;
                            part.approve_qty = part.quantity;
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

        public async Task<int> RollbackRepairStatus(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
          [Service] IConfiguration config, RepairRequest repair)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (repair == null)
                    throw new GraphQLException(new Error($"Repair object cannot be null or empty", "ERROR"));

                var rollbackRepair = new repair() { guid = repair.guid };
                context.repair.Attach(rollbackRepair);

                rollbackRepair.update_by = user;
                rollbackRepair.update_dt = currentDateTime;
                rollbackRepair.status_cv = CurrentServiceStatus.PENDING;
                rollbackRepair.remarks = repair.remarks;

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        private async Task UpdateRepairDamageCode(ApplicationServiceDBContext context, string user, long currentDateTime,
                                          repair_part repairPart, IEnumerable<rp_damage_repair>? rpDamageRepair = null)
        {
            try
            {
                if (repairPart.rp_damage_repair != null)
                {
                    foreach (var item in repairPart.rp_damage_repair)
                    {

                        //if (string.IsNullOrEmpty(item.action) && !string.IsNullOrEmpty(item.guid))
                        //   throw new GraphQLException(new Error($"Tep_damage_repair action cannot be null for update", "ERROR"));

                        if (string.IsNullOrEmpty(item.action))
                            continue;

                        if (string.IsNullOrEmpty(item.guid) && (ObjectAction.NEW.EqualsIgnore(item.action) || string.IsNullOrEmpty(item.action)))
                        {
                            var partDamage = item;//new tep_damage_repair();
                            partDamage.guid = Util.GenerateGUID();
                            partDamage.create_by = user;
                            partDamage.create_dt = currentDateTime;

                            partDamage.rp_guid = repairPart.guid;
                            partDamage.code_type = item.code_type;
                            partDamage.code_cv = item.code_cv;
                            await context.rp_damage_repair.AddAsync(partDamage);
                            continue;
                        }

                        if (ObjectAction.EDIT.EqualsIgnore(item.action))
                        {
                            if (string.IsNullOrEmpty(item.guid))
                                throw new GraphQLException(new Error($"Rep_damage_repair guid cannot null or empty for update", "ERROR"));

                            var partDamage = rpDamageRepair?.Where(t => t.guid == item.guid).FirstOrDefault();
                            //var repDamage = new rep_damage_repair() { guid = item.guid };
                            //context.Attach(repDamage);
                            if (partDamage != null)
                            {
                                partDamage.update_dt = currentDateTime;
                                partDamage.update_by = user;
                                partDamage.code_cv = item.code_cv;
                                partDamage.code_type = item.code_type;
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
                            var partDamage = rpDamageRepair?.Where(t => t.guid == item.guid).FirstOrDefault();
                            if (partDamage != null)
                            {
                                partDamage.delete_dt = currentDateTime;
                                partDamage.update_by = user;
                                partDamage.update_dt = currentDateTime;
                            }
                            continue;
                        }

                        if (ObjectAction.ROLLBACK.EqualsIgnore(item.action))
                        {
                            if (string.IsNullOrEmpty(item.guid))
                                throw new GraphQLException(new Error($"Rep_damage_repair guid cannot null or empty for rollback", "ERROR"));

                            //var repDamage = new rep_damage_repair() { guid = item.guid };
                            //context.Attach(repDamage);
                            var partDamage = rpDamageRepair?.Where(t => t.guid == item.guid).FirstOrDefault();
                            if (partDamage != null)
                            {
                                partDamage.delete_dt = null;
                                partDamage.update_by = user;
                                partDamage.update_dt = currentDateTime;
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
