using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Billing.GqlTypes.BillingResult
{
    [NotMapped]
    public class MonthlySalesList
    {
        public MonthlySales? preinspection_monthly_sales { get; set; }
        public MonthlySales? lolo_monthly_sales { get; set; }
        public MonthlySales? storage_monthly_sales { get; set; }
        public MonthlySales? gate_monthly_sales { get; set; }
        public MonthlySales? cleaning_monthly_sales { get; set; }
        public MonthlySales? residue_monthly_sales { get; set; }
        public MonthlySales? steaming_monthly_sales { get; set; }
        public MonthlySales? repair_monthly_sales { get; set; }
    }

    [NotMapped]
    public class MonthlyRevenueResult
    {
        public MonthlySales? preinspection_monthly_revenue { get; set; }
        public MonthlySales? lolo_monthly_revenue { get; set; }
        public MonthlySales? storage_monthly_revenue { get; set; }
        public MonthlySales? gate_monthly_revenue { get; set; }
        public MonthlySales? steam_monthly_revenue { get; set; }
        public MonthlySales? residue_monthly_revenue { get; set; }
        public MonthlySales? cleaning_monthly_revenue { get; set; }
        public MonthlySales? repair_monthly_revenue { get; set; }
    }

    [NotMapped]
    public class MonthlySales
    {
        public List<ResultPerDay> result_per_day { get; set; }
        public int total_count { get; set; }
        public int average_count { get; set; }
        public double total_cost { get; set; }
        public double average_cost { get; set; }
    }

    [NotMapped]
    public class YearlySalesList
    {
        public YearlySales? preinspection_yearly_sales { get; set; }
        public YearlySales? lolo_yearly_sales { get; set; }
        public YearlySales? storage_yearly_sales { get; set; }
        public YearlySales? gate_yearly_sales { get; set; }

        public YearlySales? cleaning_yearly_sales { get; set; }
        public YearlySales? residue_yearly_sales { get; set; }
        public YearlySales? steaming_yearly_sales { get; set; }
        public YearlySales? repair_yearly_sales { get; set; }
    }

    [NotMapped]
    public class YearlyRevenueManagementResult
    {
        public YearlyRevenueManagement? preinspection_yearly_revenue { get; set; }
        public YearlyRevenueManagement? lolo_yearly_revenue { get; set; }
        public YearlyRevenueManagement? storage_yearly_revenue { get; set; }
        public YearlyRevenueManagement? gate_yearly_revenue { get; set; }
        public YearlyRevenueManagement? steam_yearly_revenue { get; set; }
        public YearlyRevenueManagement? residue_yearly_revenue { get; set; }
        public YearlyRevenueManagement? cleaning_yearly_revenue { get; set; }
        public YearlyRevenueManagement? repair_yearly_revenue { get; set; }
    }

    [NotMapped]
    public class YearlySales
    {
        public List<ResultPerMonth> result_per_month { get; set; }
        public int total_count { get; set; }
        public int average_count { get; set; }
        public double total_cost { get; set; }
        public double average_cost { get; set; }
    }


    [NotMapped]
    public class YearlyRevenueManagement
    {
        public List<RevenuePerMonth> revenue_per_month { get; set; }
        public int total_count { get; set; }
        public int average_count { get; set; }
        public double total_cost { get; set; }
        public double average_cost { get; set; }
    }


    [NotMapped]
    public class MonthlyRevenue
    {
        public List<ResultPerDay> result_per_day { get; set; }
        public int total { get; set; }
        public int average { get; set; }
    }

    [NotMapped]
    public class YearlyRevenue
    {
        public List<ResultPerMonth> result_per_month { get; set; }
        public int total { get; set; }
        public int average { get; set; }
    }

    [NotMapped]
    public class TempReport
    {
        public string sot_guid { get; set; } //for opening_balance
        public double cost { get; set; } //cost
        public string code { get; set; }
        public string cc_name { get; set; }
        public long date { get; set; }
        public string purpose_repair { get; set; }
        public string tank_status { get; set; }
    }

    [NotMapped]
    public class ResultPerDay
    {
        public int count { get; set; }
        public double cost { get; set; }
        public string day { get; set; }
        public string date { get; set; }
    }

    [NotMapped]
    public class ResultPerMonth
    {
        public int count { get; set; } //for opening_balance
        public string month { get; set; }
        public double cost { get; set; }
    }

    [NotMapped]
    public class RevenuePerMonth
    {
        public int count { get; set; } //for opening_balance
        public string key { get; set; }
        public string? name { get; set; }
        public double cost { get; set; }
    }

    [NotMapped]
    public class TempRevenueResult
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

    [NotMapped]
    public class CustomerSales
    {
        public string code { get; set; }
        public string name { get; set; }
        public int tank_in_count { get; set; }
        public int clean_count { get; set; }
        public double clean_cost { get; set; } //cost
        public int steam_count { get; set; }
        public double steam_cost { get; set; } //cost
        public int residue_count { get; set; }
        public double residue_cost { get; set; } //cost
        public int in_service_count { get; set; }
        public double in_service_cost { get; set; } //cost
        public int offhire_count { get; set; }
        public double offhire_cost { get; set; } //cost
    }

    [NotMapped]
    public class CustomerMonthlySales
    {
        public List<CustomerSales> customer_sales { get; set; }
        public int total_tank_in {  get; set; }
        public int total_steam_count { get; set; }
        public double total_steam_cost { get; set; }
        public int total_clean_count { get; set; }
        public double total_clean_cost { get; set; }
        public int total_residue_count { get; set; }
        public double total_residue_cost { get; set; }
        public int total_in_service_count { get; set; }
        public double total_in_service_cost { get; set; }
        public int total_offhire_count { get; set; }
        public double total_offhire_cost { get; set; }
    }

    [NotMapped]
    public class GroupedNodeWithCost: GroupedNode
    {
        //public string FormattedDate { get; set; }
        //public int Count { get; set; }
        public double Cost { get; set; } // optional, include only if needed
    }

    [NotMapped]
    public class GroupedNode
    {
        public string FormattedDate { get; set; }
        public int Count { get; set; }

    }

}
