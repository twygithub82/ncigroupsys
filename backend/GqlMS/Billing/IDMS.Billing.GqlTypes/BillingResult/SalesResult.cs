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
        public long date { get; set; }
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

}
