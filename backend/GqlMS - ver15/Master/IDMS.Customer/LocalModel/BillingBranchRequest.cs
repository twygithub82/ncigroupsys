using IDMS.Models;
using IDMS.Models.Master;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Customer.GqlTypes.LocalModel
{
    public class BillingBranchRequest
    {
        public CustomerRequest? BranchCustomer {  get; set; } 
        public List<customer_company_contact_person?>? BranchContactPerson { get; set; }
    }
}
