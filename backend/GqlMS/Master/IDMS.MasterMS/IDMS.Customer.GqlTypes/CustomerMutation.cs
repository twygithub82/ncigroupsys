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
using System.Runtime.CompilerServices;

namespace IDMS.Customer.GqlTypes
{
    [ExtendObjectType(typeof(TemplateEstMutation))]
    public class CustomerMutation
    {
        public async Task<int> AddCustomerCompany(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor, [Service] IConfiguration config,
                [Service] IMapper mapper, CustomerRequest customer, List<customer_company_contact_person?>? contactPersons, List<BillingBranchRequest?>? billingBranches)
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

                if (contactPersons != null)
                {
                    IList<customer_company_contact_person> newContactPersonList = new List<customer_company_contact_person>();
                    foreach (var newContactPerson in contactPersons)
                    {
                        //customer_company_contact_person newContactPerson = cc;
                        //mapper.Map(cc, newContactPerson);

                        newContactPerson.guid = Util.GenerateGUID();
                        newContactPerson.create_dt = currentDateTime;
                        newContactPerson.create_by = user;
                        newContactPerson.customer_guid = newCustomer.guid;
                        newContactPersonList.Add(newContactPerson);
                    }
                    if (newContactPersonList.Count > 0)
                        await context.customer_company_contact_person.AddRangeAsync(newContactPersonList);
                }

                if (billingBranches != null)
                {
                    IList<customer_company_contact_person> branchContactPersonList = new List<customer_company_contact_person>();
                    foreach (var branch in billingBranches)
                    {
                        if (branch.BranchCustomer != null)
                        {
                            customer_company branchCustomer = new();
                            mapper.Map(branch.BranchCustomer, branchCustomer);
                            branchCustomer.guid = Util.GenerateGUID();
                            branchCustomer.create_dt = currentDateTime;
                            branchCustomer.create_by = user;;

                            await context.customer_company.AddAsync(branchCustomer);

                            if(branch.BranchContactPerson != null)
                            {
                                foreach (var ccPerson in branch.BranchContactPerson)
                                {
                                    ccPerson.guid = Util.GenerateGUID();
                                    ccPerson.create_dt = currentDateTime;
                                    ccPerson.create_by = user;
                                    ccPerson.customer_guid = branchCustomer.guid;
                                    branchContactPersonList.Add(ccPerson);
                                }
                            }
                        }
                    }
                    if (branchContactPersonList.Count > 0)
                        await context.customer_company_contact_person.AddRangeAsync(branchContactPersonList);
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

        public async Task<int> UpdateCustomerCompany(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor, [Service] IConfiguration config,
            [Service] IMapper mapper, CustomerRequest customer, List<customer_company_contact_person?>? contactPersons, List<BillingBranchRequest?>? billingBranches)
        {
            try
            {
                if (customer == null)
                    throw new GraphQLException(new Error($"Customer object or guid cannot be null", "ERROR"));

                var updateCustomer = await context.customer_company.Where(c => c.guid == customer.guid).FirstOrDefaultAsync();
                if (updateCustomer == null)
                    throw new GraphQLException(new Error($"Customer company not found", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                mapper.Map(customer, updateCustomer);
                updateCustomer.update_by = user;
                updateCustomer.update_dt = currentDateTime;

                await ProcessContantPerson(context, currentDateTime, user, customer.guid, contactPersons);

                if (billingBranches != null)
                {
                    IList<customer_company_contact_person> branchContactPersonList = new List<customer_company_contact_person>();
                    foreach (var branch in billingBranches)
                    {
                        if (branch.BranchCustomer != null)
                        {
                            if (branch.BranchCustomer.action.EqualsIgnore(ObjectAction.NEW))
                            {
                                customer_company branchCustomer = new();
                                mapper.Map(branch.BranchCustomer, branchCustomer);
                                branchCustomer.guid = Util.GenerateGUID();
                                branchCustomer.create_dt = currentDateTime;
                                branchCustomer.create_by = user; ;

                                await context.customer_company.AddAsync(branchCustomer);
                            }

                            if (branch.BranchCustomer.action.EqualsIgnore(ObjectAction.EDIT))
                            {
                                customer_company branchCustomer = new();
                                mapper.Map(branch.BranchCustomer, branchCustomer);
                
                                branchCustomer.update_dt = currentDateTime;
                                branchCustomer.update_by = user; ;

                                context.customer_company.Update(branchCustomer);
                            }

                            if (branch.BranchCustomer.action.EqualsIgnore(ObjectAction.CANCEL))
                            {
                                var delCustomer = new customer_company() { guid = branch.BranchCustomer.guid };
                                context.Attach(delCustomer);
                                delCustomer.update_by = user;
                                delCustomer.update_dt = currentDateTime;
                                delCustomer.delete_dt = currentDateTime;
                                delCustomer.main_customer_guid = 
                                delCustomer.remarks = branch.BranchCustomer.remarks;
                            }

                            await ProcessContantPerson(context, currentDateTime, user, branch.BranchCustomer.guid, branch.BranchContactPerson);
                        }
                    }
                    if (branchContactPersonList.Count > 0)
                        await context.customer_company_contact_person.AddRangeAsync(branchContactPersonList);
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

        private async Task<bool> ProcessContantPerson(ApplicationMasterDBContext context, long currentDateTime, string user, string mainCustomerGuid,
                                            List<customer_company_contact_person> contactPersons)
        {
            try
            {
                if (contactPersons != null)
                {
                    foreach (var contactPerson in contactPersons)
                    {
                        if (ObjectAction.NEW.EqualsIgnore(contactPerson.action))
                        {
                            //customer_company_contact_person newContactPerson = new();
                            //mapper.Map(cc, newContactPerson);

                            contactPerson.guid = Util.GenerateGUID();
                            contactPerson.create_dt = currentDateTime;
                            contactPerson.create_by = user;
                            contactPerson.customer_guid = mainCustomerGuid;
                            await context.customer_company_contact_person.AddAsync(contactPerson);
                        }

                        if (ObjectAction.EDIT.EqualsIgnore(contactPerson.action))
                        {
                            var extPerson = await context.customer_company_contact_person.FindAsync(contactPerson.guid);
                            if (extPerson != null)
                            {
                                extPerson.update_by = user;
                                extPerson.update_dt = currentDateTime;
                                extPerson.customer_guid = contactPerson.customer_guid;
                                extPerson.email = contactPerson.email;
                                extPerson.title_cv = contactPerson.title_cv;
                                extPerson.department = contactPerson.department;
                                extPerson.did = contactPerson.did;
                                extPerson.name = contactPerson.name;
                                extPerson.phone = contactPerson.phone;
                                extPerson.job_title = contactPerson.job_title;
                                extPerson.email_alert = contactPerson.email_alert;
                            }
                        }

                        if (ObjectAction.CANCEL.EqualsIgnore(contactPerson.action))
                        {
                            var deletedPerson = new customer_company_contact_person() { guid = contactPerson.guid };
                            context.Attach(deletedPerson);

                            deletedPerson.update_by = user;
                            deletedPerson.update_dt = currentDateTime;
                            deletedPerson.delete_dt = currentDateTime;
                        }
                    }
                }

            }
            catch(Exception ex)
            {
                throw;
            }
            return true; 
        }
    }
}
