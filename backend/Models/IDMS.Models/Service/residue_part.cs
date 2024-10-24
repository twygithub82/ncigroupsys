﻿using IDMS.Models.Tariff;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Models.Service
{
    public class residue_part : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("residue")]
        public string? residue_guid { get; set; }

        [ForeignKey("tariff_residue")]
        public string? tariff_residue_guid { get; set; }
        public string? description { get; set; }
        public int? quantity { get; set; }
        public double? cost { get; set; }
        public bool? approve_part { get; set; } 

        [UseFiltering]
        public residue? residue { get; set; }

        [UseFiltering]
        public tariff_residue? tariff_residue { get; set; }

        [NotMapped]
        public string? action { get; set; }
    }
}
