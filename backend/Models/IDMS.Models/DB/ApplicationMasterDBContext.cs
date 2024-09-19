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

            //modelBuilder.Entity<aspnetuserroles>()
            //.HasKey(sc => new { sc.userID, sc.roleID });

            //modelBuilder.Entity<aspnetuserroles>()
            //    .HasOne(sc => sc.aspnetusers)
            //    .WithMany(s => s.aspnetuserroles)
            //    .HasForeignKey(sc => sc.userID);

            //modelBuilder.Entity<aspnetuserroles>()
            //    .HasOne(sc => sc.aspnetroles)
            //    .WithMany(c => c.aspnetuserroles)
            //    .HasForeignKey(sc => sc.roleID);
        }

        //public DbSet<IDMS.Models.Tariff.tariff_cleaning> tariff_cleaning { get; set; }

        //public DbSet<IDMS.Models.Parameter.CleaningMethodWithTariff> cleaning_method { get; set; }

        //public DbSet<IDMS.Models.Parameter.CleaningCategoryWithTariff> cleaning_category { get; set; }

        //public DbSet<IDMS.Models.Package.customer_company_cleaning_category> customer_company_cleaning_category { get; set; }



        //public DbSet<IDMS.Models.Package.package_depot> package_depot { get; set; }
        //public DbSet<IDMS.Models.Package.package_residue> package_residue { get; set; }
        //public DbSet<IDMS.Models.Package.package_labour> package_labour { get; set; }
        //public DbSet<IDMS.Models.Package.package_buffer> package_buffer { get; set; }
        //public DbSet<IDMS.Models.Package.package_repair> package_repair { get; set; }
        //public DbSet<IDMS.Models.Shared.tank> tank { get; set; }

        public DbSet<currency> currency { get; set; }   
        public DbSet<customer_company> customer_company { get; set; }
        public DbSet<customer_company_contact_person> customer_company_contact_person { get; set; }
        public DbSet<template_est> template_est { get; set; }
        public DbSet<template_est_customer> template_est_customer { get; set; }
        public DbSet<template_est_part> template_est_part { get; set; }
        public DbSet<tep_damage_repair> tep_damage_repair { get; set; }

    }
}
