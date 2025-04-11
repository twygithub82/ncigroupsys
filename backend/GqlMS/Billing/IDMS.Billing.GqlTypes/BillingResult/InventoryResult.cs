using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Billing.GqlTypes.BillingResult
{
    [NotMapped]
    public class MonthlyInventoryResult
    {
        public List<MonthlyCleaningInventory>? cleaning_inventory { get; set; }
        public List<MonthlySteamingInventory>? steaming_inventory { get; set; }
        public List<MonthlyRepairInventory>? repair_inventory { get; set; }
        public MonthlyGateInOutInventory? gate_in_out_inventory { get; set; }
    }

    [NotMapped]
    public class MonthlyCleaningInventory : InventoryPerDay
    {
    }

    [NotMapped]
    public class MonthlySteamingInventory : InventoryPerDay
    {
    }

    [NotMapped]
    public class MonthlyRepairInventory
    {
        public string date { get; set; }
        public string day { get; set; }
        public double approved_hour { get; set; }
        public double completed_hour { get; set; }
    }

    [NotMapped]
    public class MonthlyGateInOutInventory
    {
        public List<MonthlyLoloInventory>? lolo_inventory { get; set; }
        public List<MonthlyGateInventory>? gate_inventory { get; set; }
    }

    [NotMapped]
    public class MonthlyGateInventory
    {
        public string date { get; set; }
        public string day { get; set; }
        public double gate_in_count { get; set; }
        public double gate_out_count { get; set; }
    }

    [NotMapped]
    public class MonthlyLoloInventory
    {
        public string date { get; set; }
        public string day { get; set; }
        public double lift_off_count { get; set; }
        public double lift_on_count { get; set; }
    }

    [NotMapped]
    public class InventoryPerDay
    {
        public string date { get; set; }
        public string day { get; set; }
        public double approved_count { get; set; }
        public double completed_count { get; set; }
    }


    [NotMapped]
    public class MergedMonthlyResult
    {
        public string date { get; set; }
        public string day { get; set; }
        public double appv_cost { get; set; }   
        public double complete_cost { get; set; }
    }


    [NotMapped]
    public class YearlyInventoryResult
    {
        public YearlyInventory? cleaning_yearly_inventory { get; set; }
        public YearlyInventory? steaming_yearly_inventory { get; set; }
        public YearlyInventory? repair_yearly_inventory { get; set; }
        public YearlyInventory? depot_yearly_inventory { get; set; }
        public YearlyInventory? gate_in_inventory { get; set; }
        public YearlyInventory? gate_out_inventory { get; set; }
    }

    public class YearlyInventory
    {
        [NotMapped]
        public List<InventoryPerMonth> inventory_per_month { get; set; }
        [NotMapped]
        public int total_count { get; set; }
        [NotMapped]
        public int average_count { get; set; }
    }


    [NotMapped]
    public class InventoryPerMonth
    {
        public string key { get; set; }
        public string? name { get; set; }   
        public int count { get; set; }
        public double percentage { get; set; }
    }

    [NotMapped]
    public class TempInventoryResult
    {
        public string sot_guid { get; set; } //for opening_balance
        public double? cost { get; set; } //cost
        public string code { get; set; }
        public string cc_name { get; set; }
        public long? appv_date { get; set; }
        public long? complete_date { get; set; }
        public string status { get; set; }
        public string? date { get; set; }
    }
}
