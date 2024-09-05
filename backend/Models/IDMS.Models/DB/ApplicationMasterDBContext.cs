using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Package;
using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Models.Master.GqlTypes.DB
{
    public class ApplicationMasterDBContext : DbContext
    {
        public ApplicationMasterDBContext(DbContextOptions<ApplicationMasterDBContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<template_est_part>()
                       .HasOne(p => p.tep_damage_repair)
                       .WithMany() // Assuming `tep_damage_repair` does not have a collection navigation property
                       .HasForeignKey(p => p.damage_code_guid);
            //.OnDelete(DeleteBehavior.Restrict); // Adjust delete behavior as needed

            modelBuilder.Entity<template_est_part>()
                .HasOne(p => p.tep_damage_repair)
                .WithMany() // Assuming `tep_damage_repair` does not have a collection navigation property
                .HasForeignKey(p => p.repair_code_guid);
                //.OnDelete(DeleteBehavior.Restrict); // Adjust delete behavior as needed
        }

        //public DbSet<IDMS.Models.Tariff.tariff_cleaning> tariff_cleaning { get; set; }

        //public DbSet<IDMS.Models.Parameter.CleaningMethodWithTariff> cleaning_method { get; set; }

        //public DbSet<IDMS.Models.Parameter.CleaningCategoryWithTariff> cleaning_category { get; set; }
        
        //public DbSet<IDMS.Models.Package.customer_company_cleaning_category> customer_company_cleaning_category { get; set; }
        //public DbSet<IDMS.Models.Master.customer_company> customer_company { get; set; }

        //public DbSet<IDMS.Models.Inventory.storing_order> storing_order { get; set; }

        //public DbSet<IDMS.Models.Inventory.storing_order_tank> storing_order_tank { get; set; }

        //public DbSet<IDMS.Models.Tariff.tariff_depot> tariff_depot { get; set; }

        //public DbSet<IDMS.Models.Tariff.tariff_buffer> tariff_buffer { get; set; }

        //public DbSet<IDMS.Models.Tariff.tariff_labour> tariff_labour { get; set; }

        //public DbSet<IDMS.Models.Tariff.tariff_residue> tariff_residue { get; set; }

        //public DbSet<IDMS.Models.Tariff.tariff_repair> tariff_repair { get; set; }

        //public DbSet<IDMS.Models.Package.package_depot> package_depot { get; set; }
        //public DbSet<IDMS.Models.Package.package_residue> package_residue { get; set; }
        //public DbSet<IDMS.Models.Package.package_labour> package_labour { get; set; }
        //public DbSet<IDMS.Models.Package.package_buffer> package_buffer { get; set; }
        //public DbSet<IDMS.Models.Package.package_repair> package_repair { get; set; }
        //public DbSet<IDMS.Models.Shared.tank> tank { get; set; }
        public DbSet<template_est> template_est { get; set; }

    }
}
