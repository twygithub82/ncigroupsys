﻿using HotChocolate;
using HotChocolate.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Models.Inventory
{

    public class out_gate : Dates
    {
        [Key]
        public string? guid { get; set; } = "";

        [IsProjected(true)]
        [ForeignKey("tank")]
        public string? so_tank_guid { get; set; } = "";

        [NotMapped]
        public string? haulier { get; set; } = "";
        public string? eir_no { get; set; } = "";
        public long? eir_dt { get; set; }
        public string? eir_status_cv { get; set; } = "";
        public string? vehicle_no { get; set; } = "";
        public string? yard_cv { get; set; } = "";
        public string? driver_name { get; set; } = "";
        public string? remarks { get; set; }
        public string? publish_by { get; set; }
        public long? publish_dt { get; set; }
        public storing_order_tank? tank { get; set; } = null;
        public out_gate_survey? out_gate_survey { get; set; }
    }
}
