﻿using IDMS.Models.Inventory;
using IDMS.Models.Service;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Inventory.GqlTypes.LocalModel
{
    [NotMapped]
    public class TankPurposeRequest
    {
        public string? guid { get; set; }
        public storing_order_tank storing_order_tank { get; set; }
        public string tank_comp_guid { get; set; }  
        public string? job_no { get; set; }
        public long in_gate_dt { get; set; }
        public List<PurposeChanges> purpose_changes { get; set; } 
        public ResidueRequest? residue_request { get; set; }
    }

    [NotMapped]
    public class PurposeChanges
    {
        public string type { get; set; }
        public string action { get; set; }
    }

    [NotMapped]
    public class ResidueRequest
    {
        public string residue_guid { get; set; }
        public List<string> residue_part_guid { get; set; }
    }
}
