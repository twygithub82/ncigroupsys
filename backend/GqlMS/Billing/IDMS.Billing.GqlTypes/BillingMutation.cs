﻿using HotChocolate;
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
                    updateBill.invoice_dt = currentDateTime;
                    updateBill.invoice_due = updateBilling.invoice_due;
                    updateBill.status_cv = updateBilling.status_cv;
                    updateBill.remarks = updateBilling.remarks;
                    updateBill.currency_guid = updateBilling.currency_guid;
                    updateBill.bill_to_guid = updateBilling.bill_to_guid;
                }

                foreach (var item in billingEstimateRequests)
                {
                    if (item.action.EqualsIgnore(ObjectAction.NEW) || item.action.EqualsIgnore(ObjectAction.EDIT))
                        item.billing_guid = updateBilling.guid;
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

        private async Task EstimateHandling(ApplicationBillingDBContext context, string user, long currentDateTime, List<BillingEstimateRequest> billingEstimateRequests)
        {

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
                        context.Set<steaming>().Attach( steaming);
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
                        var repair = new repair() { guid = item.process_guid };
                        context.Set<repair>().Attach(repair);
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
    }
}