using IDMS.Models.Master;
using IDMS.Models.Service;
using IDMS.Models.Shared;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace IDMS.Models.Billing
{
    public class billing: Dates
    {
        [Key]
        public string? guid {  get; set; }

        [ForeignKey("currency")]
        public string currency_guid { get; set; }

        [ForeignKey("customer_company")]
        public string bill_to_guid { get; set; }
        public string invoice_no { get; set; }
        public long invoice_dt { get; set; }
        public long? invoice_due { get; set; }
        public string? invoice_type { get; set; }
        public string status_cv { get; set; }
        public string? remarks { get; set; }
        public currency? currency { get; set; }

        [UseFiltering]
        public customer_company? customer_company { get; set; }
        [UseFiltering]
        public IEnumerable<cleaning?>? cleaning { get; set; }
        [UseFiltering]
        public IEnumerable<steaming?>? steaming { get; set; }
        [UseFiltering]
        public IEnumerable<residue?>? residue { get; set; }
        [UseFiltering]
        public IEnumerable<repair?>? repair_customer { get; set; }
        [UseFiltering]
        public IEnumerable<repair?>? repair_owner { get; set; }

        [UseFiltering]
        public IEnumerable<billing_sot?>? lon_billing_sot { get; set; }
        [UseFiltering]
        public IEnumerable<billing_sot?>? loff_billing_sot { get; set; }
        [UseFiltering]
        public IEnumerable<billing_sot?>? preinsp_billing_sot { get; set; }
        [UseFiltering]
        public IEnumerable<billing_sot?>? storage_billing_sot { get; set; }
        [UseFiltering]
        public IEnumerable<billing_sot?>? gin_billing_sot { get; set; }
        [UseFiltering]
        public IEnumerable<billing_sot?>? gout_billing_sot { get; set; }
        [UseFiltering]
        public IEnumerable<storage_detail?>? storage_detail { get; set; }
    }
}
