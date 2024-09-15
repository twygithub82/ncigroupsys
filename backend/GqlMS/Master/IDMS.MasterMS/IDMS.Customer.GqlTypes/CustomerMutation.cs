using HotChocolate;
using HotChocolate.Types;
using IDMS.EstimateTemplate.GqlTypes;
using IDMS.Models.Master.GqlTypes.DB;
using IDMS.Models.Master;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using CommonUtil.Core.Service;
using IDMS.Customer.GqlTypes.LocalModel;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Inventory;

namespace IDMS.Customer.GqlTypes
{
    [ExtendObjectType(typeof(TemplateEstMutation))]
    public class CustomerMutation
    {
        public async Task<int> AddCustomerCompany(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IConfiguration config, [Service] IMapper mapper, CustomerRequest customer)
        {
            try
            {
                if (customer == null)
                    throw new GraphQLException(new Error($"Customer object cannot be null", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                customer_company newCustomer = new();
                mapper.Map(customer, newCustomer);
                newCustomer.guid = Util.GenerateGUID();
                newCustomer.create_dt = currentDateTime;
                newCustomer.create_by = user;

                await context.customer_company.AddAsync(newCustomer);
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

        public async Task<int> UpdateCustomerCompany(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, [Service] IMapper mapper, CustomerRequest customer)
        {
            try
            {
                if (customer == null)
                    throw new GraphQLException(new Error($"Customer object or guid cannot be null", "ERROR"));

                var updateCustomer = await context.customer_company.Where(c => c.guid.EqualsIgnore(customer.guid)).FirstOrDefaultAsync();
                if(updateCustomer == null)
                    throw new GraphQLException(new Error($"Customer company not found", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                mapper.Map(customer, updateCustomer);
                updateCustomer.update_by = user;
                updateCustomer.update_dt = currentDateTime;

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

        public async Task<int> DeleteCustomerCompany(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
         [Service] IConfiguration config, List<string> customerGuids)
        {
            try
            {
                var res = 0;
                string user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var id in customerGuids)
                {
                    var customer = new customer_company() { guid = id };
                    context.Attach(customer);

                    customer.update_dt = currentDateTime;
                    customer.update_by = user;
                    customer.delete_dt = currentDateTime;
                }

                res = await context.SaveChangesAsync();
                //TODO
                //string updateCourseTopic = $"{course.Id}_{nameof(Subscription.CourseUpdated)}";
                //await topicEventSender.SendAsync(updateCourseTopic, course);
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }

        }

    }
}
