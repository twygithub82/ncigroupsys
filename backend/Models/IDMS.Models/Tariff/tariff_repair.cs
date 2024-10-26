using IDMS.Models.Master;
using IDMS.Models.Package;
using IDMS.Models.Service;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Tariff
{
    public class tariff_repair :Dates
    {
        [Key]
        public string guid { get; set; }
        public string? group_name_cv { get; set; }
        public string? subgroup_name_cv { get; set; }
        public string? part_name { get; set; }
        public string? alias { get; set; }
        public string? dimension { get; set; }
        public double? height_diameter { get; set; }
        public string? height_diameter_unit_cv { get; set; }
        public double? width_diameter { get; set; }
        public string? width_diameter_unit_cv { get; set; }
        public double? thickness { get; set; }
        public string? thickness_unit_cv { get; set; }
        public double? length { get; set; }
        public string? length_unit_cv { get; set; }
        public double? labour_hour { get; set; }
        public double? material_cost { get; set; }
        public string? remarks { get; set; }

        [UseFiltering]
        public IEnumerable<template_est_part>? template_est_part { get; set; }
        
        [UseFiltering]
        public IEnumerable<repair_est_part>? repair_est_part { get; set; }

        [UseFiltering]
        public IEnumerable<package_repair>? package_repair { get; set; }

        //public package_repair? package_repair { get; set; } 
    }
}
