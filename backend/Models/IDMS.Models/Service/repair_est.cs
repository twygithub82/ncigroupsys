﻿using IDMS.Models.Inventory;
using IDMS.Models.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Service
{
    public class repair_est : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("storing_order_tank")]
        public string sot_guid { get; set; }

        [ForeignKey("aspnetsuser")]
        public string? aspnetusers_guid { get; set; }
        public string? estimate_no { get; set; }
        public double labour_cost_discount { get; set; }
        public double material_cost_discount { get; set; }
        public double total_cost { get; set; }
        public string? remarks { get; set; }   
        public bool? owner_enable { get; set; }
        public storing_order_tank? storing_order_tank { get; set; }
        public aspnetusers? aspnetsuser { get; set; }
        //public IEnumerable<template_est_customer>? template_est_customer { get; set; }
        public IEnumerable<repair_est_part>? repair_est_part { get; set; }
    }
}