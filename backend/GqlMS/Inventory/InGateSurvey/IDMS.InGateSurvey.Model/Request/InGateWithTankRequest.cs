using HotChocolate;
using IDMS.Models.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.InGateSurvey.Model.Request
{
    public class InGateWithTankRequest
    {
        [GraphQLName("in_gate")]
        public InGateWithTank? InGateWithTank { get; set; }
    }
}
