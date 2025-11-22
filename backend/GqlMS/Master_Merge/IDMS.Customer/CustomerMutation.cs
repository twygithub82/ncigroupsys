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
using static IDMS.Customer.GqlTypes.LocalModel.StatusConstant;
using HotChocolate.Authorization;
using Microsoft.Extensions.Logging;

namespace IDMS.Customer.GqlTypes
{
    [ExtendObjectType(typeof(TemplateEstMutation))]
    public class CustomerMutation
    {
        private readonly ILogger<CustomerMutation> _logger;
        const string graphqlErrorCode = "ERROR";

        public CustomerMutation(ILogger<CustomerMutation> logger)
        {
            _logger = logger;
        }

        public async Task<int> AddCustomerCompany(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor, [Service] IConfiguration config,
                [Service] IMapper mapper, CustomerRequest customer, List<customer_company_contact_person?>? contactPersons, List<BillingBranchRequest?>? billingBranches)
        {
            try
            {
                if (customer == null)
                {
                    _logger.LogWarning("Customer object cannot be null");
                    throw new GraphQLException(new Error($"Customer object cannot be null", "ERROR"));
                }
                    

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                customer_company newCustomer = new();
                mapper.Map(customer, newCustomer);
                newCustomer.guid = Util.GenerateGUID();
                newCustomer.create_dt = currentDateTime;
                newCustomer.create_by = user;
                newCustomer.update_dt = currentDateTime;
                newCustomer.update_by = user;

                await context.customer_company.AddAsync(newCustomer);

                if (contactPersons != null)
                {
                    IList<customer_company_contact_person> newContactPersonList = new List<customer_company_contact_person>();
                    foreach (var newContactPerson in contactPersons)
                    {
                        if (newContactPerson == null)
                            continue;

                        newContactPerson.guid = Util.GenerateGUID();
                        newContactPerson.create_dt = currentDateTime;
                        newContactPerson.create_by = user;
                        newContactPerson.update_dt = currentDateTime;
                        newContactPerson.update_by = user;
                        newContactPerson.customer_guid = newCustomer.guid;
                        newContactPersonList.Add(newContactPerson);
                    }
                    if (newContactPersonList.Count > 0)
                    {
                        _logger.LogInformation("Adding {Count} contact person(s) for customer {Guid}", newContactPersonList.Count, newCustomer.guid);
                        await context.customer_company_contact_person.AddRangeAsync(newContactPersonList);
                    }
                }

                if (billingBranches != null)
                {
                    IList<customer_company_contact_person> branchContactPersonList = new List<customer_company_contact_person>();
                    foreach (var branch in billingBranches)
                    {
                        if (branch?.BranchCustomer != null)
                        {
                            customer_company branchCustomer = new();
                            mapper.Map(branch.BranchCustomer, branchCustomer);
                            branchCustomer.guid = Util.GenerateGUID();
                            branchCustomer.create_dt = currentDateTime;
                            branchCustomer.create_by = user;
                            branchCustomer.update_dt = currentDateTime;
                            branchCustomer.update_by = user;

                            _logger.LogInformation("Adding billing branch customer with GUID {Guid}", branchCustomer.guid);
                            await context.customer_company.AddAsync(branchCustomer);

                            if (branch.BranchContactPerson != null)
                            {
                                foreach (var ccPerson in branch.BranchContactPerson)
                                {
                                    ccPerson.guid = Util.GenerateGUID();
                                    ccPerson.create_dt = currentDateTime;
                                    ccPerson.create_by = user;
                                    ccPerson.update_dt = currentDateTime;
                                    ccPerson.update_by = user;
                                    ccPerson.customer_guid = branchCustomer.guid;
                                    branchContactPersonList.Add(ccPerson);
                                }
                            }
                        }
                    }
                    if (branchContactPersonList.Count > 0)
                    {
                        _logger.LogInformation("Adding {Count} branch contact person(s) for billing branches", branchContactPersonList.Count);
                        await context.customer_company_contact_person.AddRangeAsync(branchContactPersonList);
                    }
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("AddCustomerCompany completed. Saved {Changes} change(s) to the database. Customer GUID: {Guid}", res, customer.guid);

                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in AddCustomerCompany: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }

        }

        public async Task<int> UpdateCustomerCompany(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor, [Service] IConfiguration config,
            [Service] IMapper mapper, CustomerRequest customer, List<customer_company_contact_person?>? contactPersons, List<BillingBranchRequest?>? billingBranches)
        {
            try
            {
                if (customer == null)
                {
                    _logger.LogWarning("Customer object cannot be null");
                    throw new GraphQLException(new Error($"Customer object cannot be null", "ERROR"));
                }

                var updateCustomer = await context.customer_company.Where(c => c.guid == customer.guid).FirstOrDefaultAsync();
                if (updateCustomer == null)
                {
                    _logger.LogWarning("Customer company with GUID {Guid} not found", customer.guid);
                    throw new GraphQLException(new Error($"Customer company not found", "ERROR"));
                }

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
                        if (branch?.BranchCustomer != null)
                        {
                            var mainCustomerGuid = "";
                            if (branch.BranchCustomer.action.EqualsIgnore(ObjectAction.NEW))
                            {
                                customer_company branchCustomer = new();
                                mapper.Map(branch.BranchCustomer, branchCustomer);
                                branchCustomer.guid = Util.GenerateGUID();
                                branchCustomer.create_dt = currentDateTime;
                                branchCustomer.create_by = user;
                                branchCustomer.update_dt = currentDateTime;
                                branchCustomer.update_by = user;

                                mainCustomerGuid = branchCustomer.guid;
                                _logger.LogInformation("Adding new billing branch customer (NEW) with GUID {Guid}", branchCustomer.guid);
                                await context.customer_company.AddAsync(branchCustomer);
                            }

                            if (branch.BranchCustomer.action.EqualsIgnore(ObjectAction.EDIT))
                            {
                                customer_company branchCustomer = new();
                                mapper.Map(branch.BranchCustomer, branchCustomer);

                                branchCustomer.update_dt = currentDateTime;
                                branchCustomer.update_by = user; ;
                                mainCustomerGuid = branch.BranchCustomer.guid;
                                _logger.LogInformation("Updating billing branch customer (EDIT) with GUID {Guid}", mainCustomerGuid);
                                context.customer_company.Update(branchCustomer);
                            }

                            if (branch.BranchCustomer.action.EqualsIgnore(ObjectAction.CANCEL))
                            {
                                var delCustomer = new customer_company() { guid = branch.BranchCustomer.guid };
                                context.Attach(delCustomer);
                                delCustomer.update_by = user;
                                delCustomer.update_dt = currentDateTime;
                                //delCustomer.delete_dt = currentDateTime;
                                delCustomer.remarks = branch.BranchCustomer.remarks;
                                delCustomer.main_customer_guid = "";
                                mainCustomerGuid = branch.BranchCustomer.guid;

                                _logger.LogInformation("Marking billing branch customer (CANCEL) with GUID {Guid} as cancelled/unlinked", mainCustomerGuid);
                            }

                            await ProcessContantPerson(context, currentDateTime, user, mainCustomerGuid, branch.BranchContactPerson?.Where(cp => cp != null).Select(cp => cp!).ToList() ?? new List<customer_company_contact_person>());
                        }
                    }
                    if (branchContactPersonList.Count > 0)
                        await context.customer_company_contact_person.AddRangeAsync(branchContactPersonList);
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("UpdateCustomerCompany completed for GUID {Guid}. Saved {Changes} change(s).", customer.guid, res);

                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateCustomerCompany for GUID {Guid}: {Message}", customer?.guid, ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
        }

        [Authorize]
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


                foreach (var id in customerGuids)
                {
                    var branchCustomers = await context.customer_company.Where(cc => cc.main_customer_guid == id && cc.type_cv == "BRANCH" && cc.delete_dt == null).ToListAsync();
                    foreach (var branch in branchCustomers)
                    {
                        branch.update_by = user;
                        branch.update_dt = currentDateTime;
                        branch.main_customer_guid = null;
                        context.Entry(branch).Property(b => b.main_customer_guid).IsModified = true;

                        _logger.LogInformation("Unlinked branch customer {BranchGuid} from main customer {MainGuid}", branch.guid, id);
                    }
                }

                res = await context.SaveChangesAsync();
                _logger.LogInformation("DeleteCustomerCompany completed. Saved {Changes} change(s).", res);

                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteCustomerCompany: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
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
                        if (contactPerson == null)
                            continue;

                        if (ObjectAction.NEW.EqualsIgnore(contactPerson.action))
                        {
                            contactPerson.guid = Util.GenerateGUID();
                            contactPerson.create_dt = currentDateTime;
                            contactPerson.create_by = user;
                            contactPerson.update_dt = currentDateTime;
                            contactPerson.update_by = user;
                            contactPerson.customer_guid = mainCustomerGuid;
                            await context.customer_company_contact_person.AddAsync(contactPerson);

                            _logger.LogInformation("Added new contact person {Guid} for customer {CustomerGuid}", contactPerson.guid, mainCustomerGuid);
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

                                _logger.LogInformation("Updated contact person {Guid}", extPerson.guid);
                            }
                            else
                            {
                                _logger.LogWarning("Contact person to edit not found: {Guid}", contactPerson.guid);
                            }
                        }

                        if (ObjectAction.CANCEL.EqualsIgnore(contactPerson.action))
                        {
                            var deletedPerson = new customer_company_contact_person() { guid = contactPerson.guid };
                            context.Attach(deletedPerson);

                            deletedPerson.update_by = user;
                            deletedPerson.update_dt = currentDateTime;
                            deletedPerson.delete_dt = currentDateTime;

                            _logger.LogInformation("Marked contact person {Guid} as deleted", contactPerson.guid);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in ProcessContantPerson for mainCustomerGuid {Guid}: {Message}", mainCustomerGuid, ex.Message);
                throw new GraphQLException(
                                ErrorBuilder.New()
                                    .SetMessage(ex.Message)
                                    .SetCode(graphqlErrorCode)
                                    .Build());
            }
            return true;
        }
    }
}
