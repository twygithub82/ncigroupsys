﻿using HotChocolate;
using IDMS.Models.Tariff;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Inventory
{
    public class storing_order_tank:Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("storing_order")]
        public string? so_guid {  get; set; }

        public string? unit_type_guid { get; set; }

        [ForeignKey("tariff_cleaning")]
        public string? last_cargo_guid { get; set; }

        public string? tank_no { get; set; }

        public string? job_no { get; set; }

        public long? eta_dt { get; set; }

        public bool? purpose_steam { get; set; }

        public bool? purpose_storage { get; set; }

        public bool? purpose_cleaning { get; set; }

        public string? purpose_repair_cv { get; set; }

        public float? required_temp { get; set; }

        public string? clean_status_cv { get; set; }

        public string? estimate_cv { get; set; }

        public string? certificate_cv { get; set; }

        public string? remarks { get; set; }

        public long? etr_dt { get; set; }

        public string? status_cv { get; set; }

        public string? tank_status_cv { get; set; }

        [GraphQLName("in_gate")]
        public InGateWithTank? in_gate { get; set; }

        public storing_order? storing_order { get; set; }

        public tariff_cleaning? tariff_cleaning { get; set; }

        [GraphQLName("booking")]
        public BookingWithTanks? booking { get; set; }

    }
}