using IDMS.Models.Billing;
using IDMS.Models.DB;
using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Package;
using IDMS.Models.Parameter;
using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Models.Master.GqlTypes.DB
{
    public class ApplicationMasterDBContext : BaseDBContext
    {
        public ApplicationMasterDBContext(DbContextOptions<ApplicationMasterDBContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<customer_company>()
                .HasKey(e => e.guid);


            modelBuilder.Entity<cleaning_category>()
                .HasKey(e => e.guid);

            modelBuilder.Entity<cleaning_method>()
                .HasKey(e => e.guid);
        }

        public DbSet<currency> currency { get; set; }   
        public DbSet<customer_company> customer_company { get; set; }
        public DbSet<customer_company_contact_person> customer_company_contact_person { get; set; }
        public DbSet<template_est> template_est { get; set; }
        public DbSet<template_est_customer> template_est_customer { get; set; }
        public DbSet<template_est_part> template_est_part { get; set; }
        public DbSet<tep_damage_repair> tep_damage_repair { get; set; }
        public DbSet<storing_order> storing_order { get; set; }
        public DbSet<cleaning_method> cleaning_method { get; set; }
        public DbSet<cleaning_category> cleaning_category { get; set; }
        public DbSet<cleaning_formula> cleaning_formula { get; set; }
        public DbSet<cleaning_method_formula> cleaning_method_formula { get; set; }
        public DbSet<customer_company_cleaning_category> customer_company_cleaning_category { get; set; }

    }
}
