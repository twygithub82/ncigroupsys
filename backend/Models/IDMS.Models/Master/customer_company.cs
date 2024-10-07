using IDMS.Models.Inventory;
using IDMS.Models.Package;
using IDMS.Models.Shared;

//using IDMS.StoringOrder.Model.Domain.Customer;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Models.Master
{
    public class customer_company : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("currency")]
        public string? currency_guid { get; set; }
        public string? name { get; set; }
        public string? type_cv { get; set; }
        public string? code { get; set; }
        //public string? description { get; set; }
        //public string? alias { get; set; }
        public string? address_line1 { get; set; }
        public string? address_line2 { get; set; }
        public string? city { get; set; }
        public string? country { get; set; }
        public string? postal { get; set; }
        public string? phone { get; set; }
        //public string? fax { get; set; }
        public string? email { get; set; }
        public string? website { get; set; }
        public long? effective_dt { get; set; }
        public long? agreement_due_dt { get; set; }

        [ForeignKey("template_est")]
        public string? def_template_guid { get; set; }

        public currency? currency { get; set; }
        public template_est? template_est { get; set; } 
        public IEnumerable<storing_order_tank>? storing_order_tank { get; set; }
        public IEnumerable<storing_order>? storing_orders { get; set; }
        [UseFiltering]
        public IEnumerable<customer_company_contact_person>? cc_contact_person { get; set; }
        public IEnumerable<release_order>? release_order { get; set; }
        public IEnumerable<package_residue>? package_residue { get; set; }
        public IEnumerable<package_buffer>? package_buffer { get; set; }
        public IEnumerable<package_repair>? package_repair { get; set; }
        public IEnumerable<template_est_customer>? template_est_customer { get; set; }
    }


    public class CustomerCompanyWithPackageCleaning : customer_company
    {
        public IEnumerable<customer_company_cleaning_category>? package_cleaning { get; set; }
    }
}
