using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using IDMS.Billing.Application;
using CommonUtil.Core.Service;
using IDMS.Models.Billing;
using IDMS.Models.DB;
using IDMS.Billing.GqlTypes.LocalModel;
using IDMS.Models.Service;
using System.ComponentModel.Design;
using Microsoft.EntityFrameworkCore.ValueGeneration.Internal;
using IDMS.Models.Shared;
using System.Data.Entity;

namespace IDMS.Billing.GqlTypes
{
    public class BillingMutation
    {
        public async Task<int> AddBilling(ApplicationBillingDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, billing newBilling, List<BillingEstimateRequest> billingEstimateRequests)
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
                await context.billing.AddAsync(newBill);

                foreach (var item in billingEstimateRequests)
                {
                    if (item.action.EqualsIgnore(ObjectAction.NEW))
                        item.billing_guid = newBill.guid;
                    else if (item.action.EqualsIgnore(ObjectAction.CANCEL))
                        item.billing_guid = null;
                }

                await EstimateHandling(context, user, currentDateTime, billingEstimateRequests);
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
            [Service] IConfiguration config, billing? updateBilling, List<BillingEstimateRequest> billingEstimateRequests)
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
                    updateBill.status_cv = updateBilling.status_cv;
                    updateBill.remarks = updateBilling.remarks;
                    updateBill.currency_guid = updateBilling.currency_guid;
                    updateBill.bill_to_guid = updateBilling.bill_to_guid;
                }


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

            foreach (var item in billingEstimateRequests)
            {
                switch (item.process_type.ToUpper())
                {
                    case ProcessType.CLEANING:
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
                    case ProcessType.STEAMING:
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
                    case ProcessType.RESIDUE:
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
                    case ProcessType.REPAIR:
                        if (item.process_guid != prevRepairProcessID)
                        {
                            repair = new repair() { guid = item.process_guid };
                            context.Set<repair>().Attach(repair);
                            prevRepairProcessID = item.process_guid;
                        }

                        if(repair != null)
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

                        if (processType.EqualsIgnore(ProcessType.LOLO))
                        {
                            billingSot.lolo_billing_guid = item.billing_guid;
                            context.Entry(billingSot).Property(p => p.lolo_billing_guid).IsModified = true;
                        }
                        else if (processType.EqualsIgnore(ProcessType.GATE))
                        {
                            billingSot.gateio_billing_guid = item.billing_guid;
                            context.Entry(billingSot).Property(p => p.gateio_billing_guid).IsModified = true;
                        }
                        else if (processType.EqualsIgnore(ProcessType.PREINSPECTION))
                        {
                            billingSot.preinsp_billing_guid = item.billing_guid;
                            context.Entry(billingSot).Property(p => p.preinsp_billing_guid).IsModified = true;
                        }
                        else if (processType.EqualsIgnore(ProcessType.STORAGE))
                        {
                            billingSot.storage_billing_guid = item.billing_guid;
                            context.Entry(billingSot).Property(p => p.storage_billing_guid).IsModified = true;
                        }
                        break;
                }
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

                //var updateBS = new billing_sot() { guid = updateBillingSOT.guid };
                //context.billing_sot.Attach(updateBS);

                var updateBS = await context.billing_sot.FindAsync(updateBillingSOT.guid);
                if(updateBS != null)
                {
                    updateBS.update_by = user;
                    updateBS.update_dt = currentDateTime;
                    updateBS.lift_on_cost = updateBillingSOT.lift_on_cost;
                    updateBS.lift_off_cost = updateBillingSOT.lift_off_cost;
                    updateBS.preinspection_cost = updateBillingSOT.preinspection_cost;
                    updateBS.storage_cost = updateBillingSOT.storage_cost;
                    updateBS.free_storage = updateBillingSOT.free_storage;
                    updateBS.storage_cal_cv = updateBillingSOT.storage_cal_cv;
                    updateBS.remarks = updateBillingSOT.remarks;

                    updateBS.tariff_depot_guid = updateBillingSOT.tariff_depot_guid;
                    updateBS.preinspection = updateBillingSOT.preinspection;
                    updateBS.lift_on = updateBillingSOT.lift_on;
                    updateBS.lift_off = updateBillingSOT.lift_off;
                    updateBS.gate_in = updateBillingSOT.gate_in;
                    updateBS.gate_out = updateBillingSOT.gate_out;
                    updateBS.gate_in_cost = updateBillingSOT.gate_in_cost;
                    updateBS.gate_out_cost = updateBillingSOT.gate_out_cost;
                    updateBS.depot_cost_remarks = updateBillingSOT.depot_cost_remarks;
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
                    newSD.state_cv = storageDetails.state_cv;
                    newSD.total_cost = storageDetails.total_cost;   
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
                    updateSD.total_cost = storageDetails.total_cost;
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
