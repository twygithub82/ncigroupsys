using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using IDMS.Billing.Application;
using CommonUtil.Core.Service;
using IDMS.Models.Billing;
using IDMS.Models.DB;
using IDMS.Billing.GqlTypes.LocalModel;
using IDMS.Models.Service;
using IDMS.Models.Shared;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Billing.GqlTypes
{
    public class BillingMutation
    {
        public async Task<int> AddBilling(ApplicationBillingDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, billing newBilling, List<BillingEstimateRequest> billingEstimateRequests, List<StorageDetailRequest>? storageDetail)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var newBill = new billing();
                newBill = newBilling;
                newBill.guid = Util.GenerateGUID();
                newBill.create_by = user;
                newBill.create_dt = currentDateTime;
                newBill.update_by = user;
                newBill.update_dt = currentDateTime;
                await context.billing.AddAsync(newBill);

                if (storageDetail != null)
                    await StorageDetailHandling(context, user, currentDateTime, newBill.guid, storageDetail);

                if (billingEstimateRequests != null && billingEstimateRequests.Any())
                {
                    foreach (var item in billingEstimateRequests)
                    {
                        if (item.action.EqualsIgnore(ObjectAction.NEW))
                            item.billing_guid = newBill.guid;
                        else if (item.action.EqualsIgnore(ObjectAction.CANCEL))
                            item.billing_guid = null;
                    }
                    await EstimateHandling(context, user, currentDateTime, billingEstimateRequests);

                    var existingGuid = billingEstimateRequests?.First().existing_billing_guid ?? "";
                    if (!string.IsNullOrEmpty(existingGuid))
                        await OrphanInvoiceHandling(context, user, currentDateTime, existingGuid);

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

        public async Task<int> UpdateBilling(ApplicationBillingDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, billing? updateBilling, List<BillingEstimateRequest?>? billingEstimateRequests, List<StorageDetailRequest?>? storageDetail)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (updateBilling != null)
                {
                    if (string.IsNullOrEmpty(updateBilling.guid))
                        throw new GraphQLException(new Error($"Billing guid cannot be null or empty", "ERROR"));

                    var updateBill = new billing() { guid = updateBilling.guid };
                    context.billing.Attach(updateBill);
                    updateBill.update_by = user;
                    updateBill.update_dt = currentDateTime;
                    updateBill.invoice_no = updateBilling.invoice_no;
                    updateBill.invoice_dt = updateBilling.invoice_dt;
                    updateBill.invoice_due = updateBilling.invoice_due;
                    updateBill.invoice_type = updateBilling.invoice_type;
                    updateBill.status_cv = updateBilling.status_cv;
                    updateBill.remarks = updateBilling.remarks;
                    updateBill.currency_guid = updateBilling.currency_guid;
                    updateBill.bill_to_guid = updateBilling.bill_to_guid;

                    //currentBillingGuid = updateBilling.guid;
                }

                if (storageDetail != null)
                    await StorageDetailHandling(context, user, currentDateTime, updateBilling?.guid, storageDetail);

                if (billingEstimateRequests != null && billingEstimateRequests.Any())
                {
                    List<BillingEstimateRequest> billingEstimateList = new List<BillingEstimateRequest>();
                    foreach (var item in billingEstimateRequests)
                    {
                        if (item.action.EqualsIgnore(ObjectAction.NEW) || item.action.EqualsIgnore(ObjectAction.EDIT))
                        {
                            item.billing_guid = updateBilling.guid;
                            billingEstimateList.Add(item);
                        }
                        else if (item.action.EqualsIgnore(ObjectAction.CANCEL))
                        {
                            item.billing_guid = null;
                            billingEstimateList.Add(item);
                        }
                    }
                    await EstimateHandling(context, user, currentDateTime, billingEstimateList);

                    var existingGuid = billingEstimateRequests?.First()?.existing_billing_guid ?? "";
                    if (!string.IsNullOrEmpty(existingGuid))
                        await OrphanInvoiceHandling(context, user, currentDateTime, existingGuid);
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

        public async Task<int> UpdateBillingInvoices(ApplicationBillingDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<billing> billingInvoices)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (billingInvoices != null)
                {
                    foreach (var item in billingInvoices)
                    {
                        if (string.IsNullOrEmpty(item.guid))
                            throw new GraphQLException(new Error($"Billing guid cannot be null or empty", "ERROR"));

                        var updateBill = new billing() { guid = item.guid };
                        context.billing.Attach(updateBill);
                        updateBill.update_by = user;
                        updateBill.update_dt = currentDateTime;
                        updateBill.invoice_no = item.invoice_no;
                        updateBill.invoice_dt = item.invoice_dt;
                        updateBill.invoice_due = item.invoice_due;
                        updateBill.bill_to_guid = item.bill_to_guid;
                        updateBill.remarks = item.remarks;
                        updateBill.currency_guid = item.currency_guid;
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

        private async Task EstimateHandling(ApplicationBillingDBContext context, string user, long currentDateTime, List<BillingEstimateRequest> billingEstimateRequests)
        {

            string prevRepairProcessID = "";
            repair repair = null;

            try
            {
                foreach (var item in billingEstimateRequests)
                {
                    switch (item.process_type.ToUpper())
                    {
                        case BillingType.CLEANING:
                            var cleaning = new cleaning() { guid = item.process_guid };
                            context.Set<cleaning>().Attach(cleaning);
                            cleaning.update_by = user;
                            cleaning.update_dt = currentDateTime;
                            if (item.billing_party.EqualsIgnore(BillingParty.OWNER))
                            {
                                cleaning.owner_billing_guid = item.billing_guid;
                                context.Entry(cleaning).Property(p => p.owner_billing_guid).IsModified = true;
                            }
                            else if (item.billing_party.EqualsIgnore(BillingParty.CUSTOMER))
                            {
                                cleaning.customer_billing_guid = item.billing_guid;
                                context.Entry(cleaning).Property(p => p.customer_billing_guid).IsModified = true;
                            }
                            break;
                        case BillingType.STEAMING:
                            var steaming = new steaming() { guid = item.process_guid };
                            context.Set<steaming>().Attach(steaming);
                            steaming.update_by = user;
                            steaming.update_dt = currentDateTime;
                            if (item.billing_party.EqualsIgnore(BillingParty.OWNER))
                            {
                                steaming.owner_billing_guid = item.billing_guid;
                                context.Entry(steaming).Property(p => p.owner_billing_guid).IsModified = true;
                            }
                            else if (item.billing_party.EqualsIgnore(BillingParty.CUSTOMER))
                            {
                                steaming.customer_billing_guid = item.billing_guid;
                                context.Entry(steaming).Property(p => p.customer_billing_guid).IsModified = true;
                            }
                            break;
                        case BillingType.RESIDUE:
                            var residue = new residue() { guid = item.process_guid };
                            context.Set<residue>().Attach(residue);
                            residue.update_by = user;
                            residue.update_dt = currentDateTime;
                            if (item.billing_party.EqualsIgnore(BillingParty.OWNER))
                            {
                                residue.owner_billing_guid = item.billing_guid;
                                context.Entry(residue).Property(p => p.owner_billing_guid).IsModified = true;
                            }
                            else if (item.billing_party.EqualsIgnore(BillingParty.CUSTOMER))
                            {
                                residue.customer_billing_guid = item.billing_guid;
                                context.Entry(residue).Property(p => p.customer_billing_guid).IsModified = true;
                            }
                            break;
                        case BillingType.REPAIR:
                            if (item.process_guid != prevRepairProcessID)
                            {
                                repair = new repair() { guid = item.process_guid };
                                context.Set<repair>().Attach(repair);
                                prevRepairProcessID = item.process_guid;
                            }

                            if (repair != null)
                            {
                                repair.update_by = user;
                                repair.update_dt = currentDateTime;
                                if (item.billing_party.EqualsIgnore(BillingParty.OWNER))
                                {
                                    repair.owner_billing_guid = item.billing_guid;
                                    context.Entry(repair).Property(p => p.owner_billing_guid).IsModified = true;
                                }
                                else if (item.billing_party.EqualsIgnore(BillingParty.CUSTOMER))
                                {
                                    repair.customer_billing_guid = item.billing_guid;
                                    context.Entry(repair).Property(p => p.customer_billing_guid).IsModified = true;
                                }
                            }
                            break;
                        default:
                            //For LOLO,GATEINOUT,PREINSPEC,STORAGE
                            string processType = item.process_type.ToUpper();

                            var billingSot = new billing_sot() { guid = item.process_guid };
                            context.billing_sot.Attach(billingSot);
                            billingSot.update_by = user;
                            billingSot.update_dt = currentDateTime;

                            if (processType.EqualsIgnore(BillingType.L_OFF))
                            {
                                billingSot.loff_billing_guid = item.billing_guid;
                                context.Entry(billingSot).Property(p => p.loff_billing_guid).IsModified = true;
                            }
                            else if (processType.EqualsIgnore(BillingType.L_ON))
                            {
                                billingSot.lon_billing_guid = item.billing_guid;
                                context.Entry(billingSot).Property(p => p.lon_billing_guid).IsModified = true;
                            }
                            else if (processType.EqualsIgnore(BillingType.G_IN))
                            {
                                billingSot.gin_billing_guid = item.billing_guid;
                                context.Entry(billingSot).Property(p => p.gin_billing_guid).IsModified = true;
                            }
                            else if (processType.EqualsIgnore(BillingType.G_OUT))
                            {
                                billingSot.gout_billing_guid = item.billing_guid;
                                context.Entry(billingSot).Property(p => p.gout_billing_guid).IsModified = true;
                            }
                            else if (processType.EqualsIgnore(BillingType.PREINSPECTION))
                            {
                                billingSot.preinsp_billing_guid = item.billing_guid;
                                context.Entry(billingSot).Property(p => p.preinsp_billing_guid).IsModified = true;
                            }
                            else if (processType.EqualsIgnore(BillingType.STORAGE))
                            {
                                billingSot.storage_billing_guid = item.billing_guid;
                                context.Entry(billingSot).Property(p => p.storage_billing_guid).IsModified = true;
                            }
                            break;
                    }
                }

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private async Task StorageDetailHandling(ApplicationBillingDBContext context, string user, long currentDateTime, string? billingGuid, List<StorageDetailRequest>? storageDetail)
        {
            try
            {
                foreach (var item in storageDetail)
                {
                    if (item.action.EqualsIgnore(ObjectAction.NEW))
                    {
                        if (string.IsNullOrEmpty(billingGuid))
                            throw new GraphQLException(new Error($"Billing guid cannot be null or empty", "ERROR"));

                        var newSD = new storage_detail();
                        newSD.guid = Util.GenerateGUID();
                        newSD.create_by = user;
                        newSD.create_dt = currentDateTime;
                        newSD.update_by = user;
                        newSD.update_dt = currentDateTime;

                        newSD.billing_guid = billingGuid;
                        newSD.sot_guid = item.sot_guid;
                        newSD.start_dt = item.start_dt;
                        newSD.end_dt = item.end_dt;
                        newSD.state_cv = item.state_cv;
                        newSD.total_cost = GqlUtils.CalculateMaterialCostRoundedUp(item.total_cost);
                        newSD.remaining_free_storage = item.remaining_free_storage;
                        newSD.remarks = item.remarks;

                        context.storage_detail.Add(newSD);
                    }
                    else if (item.action.EqualsIgnore(ObjectAction.EDIT))
                    {
                        if (string.IsNullOrEmpty(item.guid))
                            throw new GraphQLException(new Error($"Storage details guid cannot be null or empty", "ERROR"));

                        if (string.IsNullOrEmpty(billingGuid))
                            throw new GraphQLException(new Error($"Billing guid cannot be null or empty", "ERROR"));

                        var updateSD = await context.storage_detail.FindAsync(item.guid);
                        if (updateSD != null)
                        {
                            updateSD.update_by = user;
                            updateSD.update_dt = currentDateTime;
                            updateSD.billing_guid = billingGuid;
                            updateSD.sot_guid = item.sot_guid;
                            updateSD.start_dt = item.start_dt;
                            updateSD.end_dt = item.end_dt;
                            updateSD.state_cv = item.state_cv;
                            updateSD.total_cost = GqlUtils.CalculateMaterialCostRoundedUp(item.total_cost);
                            updateSD.remaining_free_storage = item.remaining_free_storage;
                            updateSD.remarks = item.remarks;
                        }
                    }
                    else if (item.action.EqualsIgnore(ObjectAction.CANCEL))
                    {
                        if (string.IsNullOrEmpty(item.guid))
                            throw new GraphQLException(new Error($"Storage details guid cannot be null or empty", "ERROR"));

                        var deleteSD = new storage_detail() { guid = item.guid };
                        context.Attach(deleteSD);
                        deleteSD.update_by = user;
                        deleteSD.update_dt = currentDateTime;
                        deleteSD.delete_dt = currentDateTime;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private async Task OrphanInvoiceHandling(ApplicationBillingDBContext context, string user, long currentDateTime, string? billingGuid)
        {

            try
            {
                var result = await context.billing
                                            .Where(b => b.guid == billingGuid)
                                            .Select(b => new
                                            {
                                                BillingEntity = b,
                                                b.guid,
                                                b.invoice_no,

                                                InStorageDetail = context.storage_detail.Any(sd => sd.billing_guid == b.guid) ? 1 : 0,

                                                InBillingSot = context.billing_sot.Any(bs =>
                                                    bs.preinsp_billing_guid == b.guid ||
                                                    bs.lon_billing_guid == b.guid ||
                                                    bs.loff_billing_guid == b.guid ||
                                                    bs.storage_billing_guid == b.guid ||
                                                    bs.gin_billing_guid == b.guid ||
                                                    bs.gout_billing_guid == b.guid
                                                ) ? 1 : 0,

                                                InResidue = context.residue.Any(r =>
                                                    r.customer_billing_guid == b.guid ||
                                                    r.owner_billing_guid == b.guid
                                                ) ? 1 : 0,

                                                InRepair = context.repair.Any(rep =>
                                                    rep.customer_billing_guid == b.guid ||
                                                    rep.owner_billing_guid == b.guid
                                                ) ? 1 : 0,

                                                InSteaming = context.steaming.Any(s =>
                                                    s.customer_billing_guid == b.guid ||
                                                    s.owner_billing_guid == b.guid
                                                ) ? 1 : 0,

                                                InCleaning = context.cleaning.Any(c =>
                                                    c.customer_billing_guid == b.guid ||
                                                    c.owner_billing_guid == b.guid
                                                ) ? 1 : 0
                                            })
                                            .FirstOrDefaultAsync();

                bool hasLinkedRecords = result.InStorageDetail == 0 && result.InBillingSot == 0 && result.InResidue == 0 &&
                                                   result.InRepair == 0 && result.InSteaming == 0 && result.InCleaning == 0;

                if (!hasLinkedRecords)
                {
                    result.BillingEntity.delete_dt = currentDateTime;
                    result.BillingEntity.update_by = user;
                    result.BillingEntity.update_dt = currentDateTime;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public async Task<int> UpdateBillingSOT(ApplicationBillingDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, billing_sot updateBillingSOT)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (updateBillingSOT == null || string.IsNullOrEmpty(updateBillingSOT.guid))
                    throw new GraphQLException(new Error($"Billing_SOT guid cannot be null or empty", "ERROR"));

                var updateBS = await context.billing_sot.FindAsync(updateBillingSOT.guid);
                if (updateBS != null)
                {
                    if (updateBillingSOT.action != null && updateBillingSOT.action.EqualsIgnore(ObjectAction.OVERWRITE))
                    {
                        updateBS.storage_cal_cv = updateBillingSOT.storage_cal_cv;
                        updateBS.update_by = user;
                        updateBS.update_dt = currentDateTime;
                    }
                    else
                    {
                        updateBS.update_by = user;
                        updateBS.update_dt = currentDateTime;
                        updateBS.lift_on_cost = GqlUtils.CalculateMaterialCostRoundedUp(updateBillingSOT.lift_on_cost);
                        updateBS.lift_off_cost = GqlUtils.CalculateMaterialCostRoundedUp(updateBillingSOT.lift_off_cost);
                        updateBS.preinspection_cost = GqlUtils.CalculateMaterialCostRoundedUp(updateBillingSOT.preinspection_cost);
                        updateBS.storage_cost = GqlUtils.CalculateMaterialCostRoundedUp(updateBillingSOT.storage_cost);
                        updateBS.free_storage = updateBillingSOT.free_storage;
                        updateBS.storage_cal_cv = updateBillingSOT.storage_cal_cv;
                        updateBS.remarks = updateBillingSOT.remarks;

                        updateBS.tariff_depot_guid = updateBillingSOT.tariff_depot_guid;
                        updateBS.preinspection = updateBillingSOT.preinspection;
                        updateBS.lift_on = updateBillingSOT.lift_on;
                        updateBS.lift_off = updateBillingSOT.lift_off;
                        updateBS.gate_in = updateBillingSOT.gate_in;
                        updateBS.gate_out = updateBillingSOT.gate_out;
                        updateBS.gate_in_cost = GqlUtils.CalculateMaterialCostRoundedUp(updateBillingSOT.gate_in_cost);
                        updateBS.gate_out_cost = GqlUtils.CalculateMaterialCostRoundedUp(updateBillingSOT.gate_out_cost);
                        updateBS.depot_cost_remarks = updateBillingSOT.depot_cost_remarks;
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

        private async Task<int> UpdateDepotCost(ApplicationBillingDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, billing_sot updateBillingSOT)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (updateBillingSOT == null || string.IsNullOrEmpty(updateBillingSOT.guid))
                    throw new GraphQLException(new Error($"Billing_SOT guid cannot be null or empty", "ERROR"));

                var updateBS = new billing_sot() { guid = updateBillingSOT.guid };
                context.billing_sot.Attach(updateBS);
                updateBS.update_by = user;
                updateBS.update_dt = currentDateTime;
                updateBS.lift_on_cost = updateBillingSOT.lift_on_cost;
                updateBS.lift_off_cost = updateBillingSOT.lift_off_cost;
                updateBS.preinspection_cost = updateBillingSOT.preinspection_cost;
                updateBS.storage_cost = updateBillingSOT.storage_cost;
                updateBS.free_storage = updateBillingSOT.free_storage;
                updateBS.storage_cal_cv = updateBillingSOT.storage_cal_cv;
                updateBS.remarks = updateBillingSOT.remarks;

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

        public async Task<int> UpdateStorageDetail(ApplicationBillingDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, storage_detail storageDetails)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (storageDetails == null)
                    throw new GraphQLException(new Error($"Storage details cannot be null or empty", "ERROR"));

                if (string.IsNullOrEmpty(storageDetails.guid))
                {
                    storage_detail newSD = storageDetails;
                    newSD.guid = Util.GenerateGUID();
                    newSD.create_by = user;
                    newSD.create_dt = currentDateTime;
                    newSD.update_by = user;
                    newSD.update_dt = currentDateTime;
                    newSD.state_cv = storageDetails.state_cv;
                    newSD.total_cost = GqlUtils.CalculateMaterialCostRoundedUp(storageDetails.total_cost);
                    newSD.remaining_free_storage = storageDetails.remaining_free_storage;

                    await context.AddAsync(newSD);
                }
                else
                {
                    var updateSD = new storage_detail() { guid = storageDetails.guid };
                    context.storage_detail.Attach(updateSD);
                    updateSD.update_by = user;
                    updateSD.update_dt = currentDateTime;
                    updateSD.remarks = storageDetails.remarks;
                    updateSD.total_cost = GqlUtils.CalculateMaterialCostRoundedUp(storageDetails.total_cost);
                    updateSD.remaining_free_storage = storageDetails.remaining_free_storage;
                    updateSD.state_cv = storageDetails.state_cv;
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
