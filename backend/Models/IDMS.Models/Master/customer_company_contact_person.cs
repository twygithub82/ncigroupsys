﻿using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Master
{
    public class customer_company_contact_person : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("customer_company")]
        public string? customer_guid { get; set; }
        public string? name { get; set; }
        public string? title_cv { get; set; }
        public string? job_title { get; set; }
        public string? email { get; set; }
        public string? department { get; set; }
        public string? did { get; set; }
        public string? phone { get; set; }
        public int? email_alert { get; set; } = 0;
        
        [NotMapped]
        public string? action { get; set; }
        [GraphQLIgnore]
        public customer_company? customer_company { get; set; }
    }
}
