using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Billing.GqlTypes.BillingResult
{
    public class MonthlySalesList
    {
        [NotMapped]
        public MonthlySales? preinspection_monthly_sales { get; set; }
        [NotMapped]
        public MonthlySales? lolo_monthly_sales { get; set; }
        [NotMapped]
        public MonthlySales? cleaning_monthly_sales { get; set; }
        [NotMapped]
        public MonthlySales? residue_monthly_sales { get; set; }
        [NotMapped]
        public MonthlySales? steaming_monthly_sales { get; set; }
        [NotMapped]
        public MonthlySales? repair_monthly_sales { get; set; }
    }

    public class MonthlySales
    {
        [NotMapped]
        public List<ResultPerDay> result_per_day { get; set; }
        [NotMapped]
        public int total_count { get; set; }
        [NotMapped]
        public int average_count { get; set; }
        [NotMapped]
        public double total_cost { get; set; }
        [NotMapped]
        public double average_cost { get; set; }
    }
    public class YearlySalesList
    {
        [NotMapped]
        public YearlySales? preinspection_yearly_sales { get; set; }
        [NotMapped]
        public YearlySales? lolo_yearly_sales { get; set; }
        [NotMapped]
        public YearlySales? cleaning_yearly_sales { get; set; }
        [NotMapped]
        public YearlySales? residue_yearly_sales { get; set; }
        [NotMapped]
        public YearlySales? steaming_yearly_sales { get; set; }
        [NotMapped]
        public YearlySales? repair_yearly_sales { get; set; }
    }

    public class YearlySales
    {
        [NotMapped]
        public List<ResultPerMonth> result_per_month { get; set; }
        [NotMapped]
        public int total_count { get; set; }
        [NotMapped]
        public int average_count { get; set; }
        [NotMapped]
        public double total_cost { get; set; }
        [NotMapped]
        public double average_cost { get; set; }
    }

    public class MonthlyRevenue
    {
        [NotMapped]
        public List<ResultPerDay> result_per_day { get; set; }
        [NotMapped]
        public int total { get; set; }
        public int average { get; set; }
    }

    [NotMapped]
    public class YearlyRevenueResult
    {
        public YearlySales? preinspection_yearly_revenue { get; set; }
        public YearlySales? lolo_yearly_revenue { get; set; }
        public YearlySales? storage_yearly_revenue { get; set; }
        public YearlySales? gate_yearly_revenue { get; set; }
        public YearlySales? steam_yearly_revenue { get; set; }
        public YearlySales? residue_yearly_revenue { get; set; }
        public YearlySales? cleaning_yearly_revenue { get; set; }
        public YearlySales? repair_yearly_revenue { get; set; }
    }


    public class YearlyRevenue
    {
        [NotMapped]
        public List<ResultPerMonth> result_per_month { get; set; }
        [NotMapped]
        public int total { get; set; }
        [NotMapped]
        public int average { get; set; }
    }

    public class TempReport
    {
        [NotMapped]
        public string sot_guid { get; set; } //for opening_balance
        [NotMapped]
        public double cost { get; set; } //cost
        [NotMapped]
        public string code { get; set; }
        [NotMapped]
        public string cc_name { get; set; }
        [NotMapped]
        public long date { get; set; }
        [NotMapped]
        public string purpose_repair { get; set; }
    }

    public class ResultPerDay
    {
        [NotMapped]
        public int count { get; set; }
        [NotMapped]
        public double cost { get; set; }
        [NotMapped]
        public string day { get; set; }
        [NotMapped]
        public string date { get; set; }
    }

    public class ResultPerMonth
    {
        [NotMapped]
        public int count { get; set; } //for opening_balance
        [NotMapped]
        public string month { get; set; }
        [NotMapped]
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

    public class CustomerSales
    {
        [NotMapped]
        public string code { get; set; }
        [NotMapped]
        public string name { get; set; }
        [NotMapped]
        public int tank_in_count { get; set; }
        [NotMapped]
        public int clean_count { get; set; }
        [NotMapped]
        public double clean_cost { get; set; } //cost
        [NotMapped]
        public int steam_count { get; set; }
        [NotMapped]
        public double steam_cost { get; set; } //cost
        [NotMapped]
        public int residue_count { get; set; }
        [NotMapped]
        public double residue_cost { get; set; } //cost
        [NotMapped]
        public int in_service_count { get; set; }
        [NotMapped]
        public double in_service_cost { get; set; } //cost
        [NotMapped]
        public int offhire_count { get; set; }
        [NotMapped]
        public double offhire_cost { get; set; } //cost
    }

    public class CustomerMonthlySales
    {
        [NotMapped]
        public List<CustomerSales> customer_sales { get; set; }
        [NotMapped]
        public int total_tank_in {  get; set; }
        [NotMapped]
        public int total_steam_count { get; set; }
        [NotMapped]
        public double total_steam_cost { get; set; }
        [NotMapped]
        public int total_clean_count { get; set; }
        [NotMapped]
        public double total_clean_cost { get; set; }
        [NotMapped]
        public int total_residue_count { get; set; }
        [NotMapped]
        public double total_residue_cost { get; set; }
        [NotMapped]
        public int total_in_service_count { get; set; }
        [NotMapped]
        public double total_in_service_cost { get; set; }
        [NotMapped]
        public int total_offhire_count { get; set; }
        [NotMapped]
        public double total_offhire_cost { get; set; }
    }
}
