﻿using IDMS.Models.Tariff;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter
{
    public  class cleaning_method:Dates
    {
        [Key]
        public string? guid { get; set; }

        public string? name { get; set; }

        public int? sequence { get; set; }
        public string? description { get; set; }

        // public int? duration { get; set; }

        // public string? cleaning_group_cv { get; set; }

        // public double? cost { get; set; }

        public IEnumerable<tariff_cleaning>? tariff_cleanings { get; set; }
    }

    
    public class CleaningMethodWithTariff: cleaning_method
    {
        //[Key]
        //public string? guid { get; set; }

        //public string? name { get; set; }

        //public string? description { get; set; }

        //public IEnumerable<tariff_cleaning>? tariff_cleanings { get; set; }
    }
}