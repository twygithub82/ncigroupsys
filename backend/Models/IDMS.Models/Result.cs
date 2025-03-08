﻿using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Permissions;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models
{
    public class Result
    {
        [NotMapped]
        public int result { get; set; } = -1;
    }

    public class LengthWithUnit
    {
        [NotMapped]
        public double? length { get; set; }
        [NotMapped]
        public string? length_unit_cv { get; set; }
    }

    public class CleaningInventorySummary
    {
        [NotMapped]
        public int count { get; set; }
        [NotMapped]
        public string? code { get; set; }
        [NotMapped]
        public string? name { get; set; }
    }

    public class DailyInventorySummary
    {
        [NotMapped]
        public string? code { get; set; }
        [NotMapped]
        public string? name { get; set; }
        [NotMapped]
        public int? in_gate_count { get; set; }
        [NotMapped]
        public int? out_gate_count { get;set; }
        public List<OpeningBalance?>? opening_balance { get; set; } 
    }

    public class PeriodicTestDueSummary
    {
        [NotMapped]
        public string? customer_code { get; set; }
        [NotMapped]
        public string? owner_code { get; set; }
        [NotMapped]
        public string? tank_no { get; set; }
        [NotMapped]
        public string? eir_no { get; set; }
        [NotMapped]
        public long? eir_dt { get; set; }
        [NotMapped]
        public string? class_cv { get; set; }
        [NotMapped]
        public string? last_test_type { get; set; }
        [NotMapped]
        public string? next_test_type { get; set; }
        [NotMapped]
        public long? test_dt { get; set; }
        [NotMapped]
        public long? next_test_dt { get; set; }
        [NotMapped]
        public string? due_type { get; set; }
        [NotMapped]
        public string? due_days { get; set; }
    }

    public class DailyTankSurveySummary
    {
        [NotMapped]
        public string? customer_code { get; set; }
        [NotMapped]
        public string? tank_no { get; set; }
        [NotMapped]
        public string? eir_no { get; set; }
        [NotMapped]
        public string? surveryor { get; set; }
        [NotMapped]
        public string? status { get; set; }
        [NotMapped]
        public string? survey_type { get; set; }
        [NotMapped]
        public string? visit { get; set; }
        [NotMapped]
        public long? clean_dt { get; set; }
        [NotMapped]
        public long? survey_dt { get; set; }
    }


    public class OpeningBalance
    {
        [NotMapped]
        public int open_balance { get; set; } //for opening_balance
        [NotMapped]
        public int in_count { get; set; }
        [NotMapped]
        public int out_count { get; set; }
        [NotMapped]
        public string yard { get; set; }
    }

    public class MonthlyReport
    {
        [NotMapped]
        public List<CountPerDay> count_per_day { get; set; }
        [NotMapped]
        public int total {  get; set; }
        public int average { get; set; }
    }

    public class YearlyReport
    {
        [NotMapped]
        public List<CountPerMonth> count_per_month { get; set; }
        [NotMapped]
        public int total { get; set; }
        public int average { get; set; }
    }

    public class TempReport
    {
        [NotMapped]
        public string sot_guid { get; set; } //for opening_balance
        [NotMapped]
        public string code { get; set; }
        [NotMapped]
        public long date { get; set; }

    }
    public class CountPerDay
    {
        [NotMapped]
        public int count { get; set; } //for opening_balance
        [NotMapped]
        public string day { get; set; }
        [NotMapped]
        public string date { get; set; }
    }

    public class CountPerMonth
    {
        [NotMapped]
        public int count { get; set; } //for opening_balance
        [NotMapped]
        public string month { get; set; }
        //[NotMapped]
        //public string date { get; set; }
    }


    public class DailyTeamRevenue
    {
        [NotMapped]
        public string? estimate_no { get; set; }
        [NotMapped]
        public string? tank_no { get; set; }
        [NotMapped]
        public string? eir_no { get; set; }
        [NotMapped]
        public string? code { get; set; }
        [NotMapped]
        public long? estimate_date { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public long? approved_date { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public long? allocation_date { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public long? qc_date { get; set; }
        [NotMapped]
        public string? qc_by { get; set; }
        [NotMapped]
        public string? repair_type { get; set; }
        [NotMapped]
        public double? repair_cost { get; set; }
        [NotMapped]
        public string? team { get; set; }

    }
}
