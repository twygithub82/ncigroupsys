using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Master
{
    public class template_est : Dates
    {
        [Key]
        public string? guid { get; set; }
        public string type_cv { get; set; }
        public double labour_cost_discount { get; set; }
        public double material_cost_discount { get; set; }
        public string template_name { get; set; }
        public IEnumerable<template_est_customer>? template_est_customer { get; set; }
        public IEnumerable<template_est_part>? template_est_part { get; set; }
    }
}
