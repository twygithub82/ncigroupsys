using IDMS.Models;

namespace IDMS.StoringOrder.GqlTypes.LocalModel
{
    public class CustomerCompanyRequest : Dates
    {
        public string guid { get; set; }
        public string name { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public string alias { get; set; }
        public string tariff_depot_guid { get; set; }
        public string address_line1 { get; set; }
        public string address_line2 { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string postal { get; set; }
        public string phone { get; set; }
        public string fax { get; set; }
        public string email { get; set; }
        public string website { get; set; }

        public long effective_dt { get; set; }
        public long agreement_due_dt { get; set; }
        public string type_cv { get; set; }
        public string currency_cv { get; set; }
    }
}
