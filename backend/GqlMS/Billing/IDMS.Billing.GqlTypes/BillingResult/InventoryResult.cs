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
        public double gate_in_cost { get; set; }
        public double gate_out_cost { get; set; }
    }

    [NotMapped]
    public class MonthlyLoloInventory
    {
        public string date { get; set; }
        public string day { get; set; }
        public double lift_off_cost { get; set; }
        public double lift_on_cost { get; set; }
    }

    [NotMapped]
    public class YearlyGateInOutInventory
    {
        public List<YearlyLoloInventory>? lolo_inventory { get; set; }
        public List<YearlyGateInventory>? gate_inventory { get; set; }
    }

    [NotMapped]
    public class InventoryPerDay
    {
        public string date { get; set; }
        public string day { get; set; }
        public double approved_cost { get; set; }
        public double completed_cost { get; set; }
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
        public List<YearlyCleaningInventory>? cleaning_inventory { get; set; }
        public List<YearlySteamingInventory>? steaming_inventory { get; set; }
        public List<YearlyRepairInventory>? repair_inventory { get; set; }
        public YearlyGateInOutInventory? gate_in_out_inventory { get; set; }
    }

    [NotMapped]
    public class YearlyCleaningInventory : InventoryPerMonth
    {
    }

    [NotMapped]
    public class YearlySteamingInventory : InventoryPerMonth
    {
    }

    [NotMapped]
    public class YearlyRepairInventory
    {
        public string month { get; set; }
        public double approved_hour { get; set; }
        public double completed_hour { get; set; }
    }

    [NotMapped]
    public class YearlyLoloInventory
    {
        public string month { get; set; }
        public double lift_off_cost { get; set; }
        public double lift_on_cost { get; set; }
    }


    [NotMapped]
    public class YearlyGateInventory
    {
        public string month { get; set; }
        public double gate_in_cost { get; set; }
        public double gate_out_cost { get; set; }
    }
    [NotMapped]
    public class InventoryPerMonth
    {
        public string month { get; set; }
        public double approved_cost { get; set; }
        public double completed_cost { get; set; }
    }

    [NotMapped]
    public class MergedYearlyResult
    {
        public string month { get; set; }
        public double appv_cost { get; set; } //for opening_balance
        public double complete_cost { get; set; }
    }


[NotMapped]
    public class TempInventoryResult
    {
        public string sot_guid { get; set; } //for opening_balance
        public double cost { get; set; } //cost
        public string code { get; set; }
        public string cc_name { get; set; }
        public long? appv_date { get; set; }
        public long? complete_date { get; set; }
        public string status { get; set; }
        public string? date { get; set; }
    }
}
