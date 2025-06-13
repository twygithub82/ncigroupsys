using IDMS.Models.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Inventory.GqlTypes.LocalModel
{
    [NotMapped]
    public class TankDetailRequest
    {
        public StoringOrderTank? SOT { get; set; }
        public StoringOrder? SO { get; set; }
        public InGateSurvey? IngateSurvey { get; set; }
        public List<Steaming?>? Steaming { get; set; }
        public Cleaning? Cleaning { get; set; }  
    }

    [NotMapped]
    public class Steaming
    {
        public string guid { get; set; }
        public double cost { get; set; }    
        public double labour { get; set; }
    }

    [NotMapped]
    public class Cleaning
    {
        public string guid { get; set; }
    }
}
    