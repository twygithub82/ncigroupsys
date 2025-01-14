using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using IDMS.Billing.Application;
using CommonUtil.Core.Service;
using IDMS.Models.Billing;
using IDMS.Models.DB;

namespace IDMS.Billing.GqlTypes
{
    public class BillingMutation
    {
        public async Task<int> AddBilling(ApplicationBillingDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, billing newBilling)
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
            [Service] IConfiguration config, billing updateBilling)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

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
