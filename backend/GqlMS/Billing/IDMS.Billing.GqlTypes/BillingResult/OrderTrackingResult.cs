using CommonUtil.Core.Service;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Billing.GqlTypes.BillingResult
{
    [NotMapped]
    public class OrderTrackingResult
    {
        public string? tank_no { get; set; }
        public string? eir_no { get; set; }
        public long? eir_date { get; set; }
        public long? release_date { get; set; }
        public string? customer_code { get; set; }
        public string? customer_name { get; set; }
        public string? last_cargo { get; set; }
        public string? order_no { get; set; }
        public long? order_date { get; set; }
        public long? cancel_date { get; set; }
        public string? cancel_remarks { get; set; }
        public string? status { get; set; }
        public string? purpose { get; set; }
        [GraphQLIgnore]
        public bool? purpose_storage { get; set; }
        [GraphQLIgnore]
        public bool? purpose_cleaning { get; set; }
        [GraphQLIgnore]
        public bool? purpose_steaming { get; set; }
        [GraphQLIgnore]
        public string? purpose_repair { get; set; }

        // Method to update FinalPurpose based on other properties
        public void CompileFinalPurpose()
        {
            var purposes = new List<string>();

            if ((bool)purpose_cleaning) purposes.Add("Cleaning");
            if ((bool)purpose_steaming) purposes.Add("Steaming");
            if (!string.IsNullOrEmpty(purpose_repair)) purposes.Add(purpose_repair.EqualsIgnore("repair") ? "In-Service" : CapitalizeFirstCharacter(purpose_repair.ToLower()));
            if ((bool)purpose_storage) purposes.Add("Storage");

            // Join all valid purposes into a single string and assign it to FinalPurpose
            purpose = string.Join(";", purposes);
        }
        private static string CapitalizeFirstCharacter(string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return input; // Return empty or null string as is
            }
            // Capitalize the first character and append the rest of the string unchanged
            return char.ToUpper(input[0]) + input.Substring(1);
        }
    }
}
