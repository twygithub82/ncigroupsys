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
using static IDMS.Customer.GqlTypes.LocalModel.StatusConstant;
using System.Xml.Schema;

namespace IDMS.Customer.GqlTypes
{
    [ExtendObjectType(typeof(TemplateEstMutation))]
    public class CustomerMutation
    {
        public async Task<int> AddCustomerCompany(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IConfiguration config, [Service] IMapper mapper, CustomerRequest customer, List<customer_company_contact_person?>? contactPersons)
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

                IList<customer_company_contact_person> newContactPersonList = new List<customer_company_contact_person>();
                foreach (var cc in contactPersons) 
                {
                    customer_company_contact_person newContactPerson = new();
                    mapper.Map(cc, newContactPerson);

                    newContactPerson.guid = Util.GenerateGUID();
                    newContactPerson.create_dt = currentDateTime;
                    newContactPerson.create_by = user;
                    newContactPerson.customer_guid = newCustomer.guid;

                    newContactPersonList.Add(newContactPerson);
                }

                await context.customer_company_contact_person.AddRangeAsync(newContactPersonList);
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
            [Service] IConfiguration config, [Service] IMapper mapper, CustomerRequest customer, List<customer_company_contact_person?>? contactPersons)
        {
            try
            {
                if (customer == null)
                    throw new GraphQLException(new Error($"Customer object or guid cannot be null", "ERROR"));

                var updateCustomer = await context.customer_company.Where(c => c.guid == customer.guid).FirstOrDefaultAsync();
                if(updateCustomer == null)
                    throw new GraphQLException(new Error($"Customer company not found", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                mapper.Map(customer, updateCustomer);
                updateCustomer.update_by = user;
                updateCustomer.update_dt = currentDateTime;


                foreach (var cc in contactPersons)
                {
                    if (ObjectAction.NEW.EqualsIgnore(cc.action))
                    {
                        customer_company_contact_person newContactPerson = new();
                        mapper.Map(cc, newContactPerson);

                        newContactPerson.guid = Util.GenerateGUID();
                        newContactPerson.create_dt = currentDateTime;
                        newContactPerson.create_by = user;
                        newContactPerson.customer_guid = customer.guid;

                        await context.customer_company_contact_person.AddAsync(newContactPerson);
                    }

                    if (ObjectAction.EDIT.EqualsIgnore(cc.action))
                    {
                        var extPerson = await context.customer_company_contact_person.FindAsync(cc.guid);
                        if (extPerson != null) 
                        {
                            extPerson.update_by = user;
                            extPerson.update_dt = currentDateTime;
                            extPerson.customer_guid = cc.customer_guid;
                            extPerson.email = cc.email;
                            extPerson.title_cv = cc.title_cv;
                            extPerson.department = cc.department;
                            extPerson.did = cc.did;
                            extPerson.name = cc.name;
                            extPerson.phone = cc.phone;
                            extPerson.job_title = cc.job_title;
                            extPerson.email_alert = cc.email_alert; 
                        }
                    }

                    if (ObjectAction.CANCEL.EqualsIgnore(cc.action))
                    {
                        var ccPerson = new customer_company_contact_person() { guid = cc.guid };
                        context.Attach(ccPerson);

                        ccPerson.update_by = user;
                        ccPerson.update_dt = currentDateTime;
                        cc.delete_dt = currentDateTime;
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
