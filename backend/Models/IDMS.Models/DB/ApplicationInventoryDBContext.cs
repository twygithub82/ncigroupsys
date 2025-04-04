﻿using IDMS.Models.Billing;
using IDMS.Models.DB;
using IDMS.Models.Master;
using IDMS.Models.Package;
using IDMS.Models.Parameter;
using IDMS.Models.Service;
using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Models.Inventory.InGate.GqlTypes.DB
{
    public class ApplicationInventoryDBContext : BaseDBContext
    {
        public ApplicationInventoryDBContext(DbContextOptions<ApplicationInventoryDBContext> options) : base(options)
        {
            
        }

        public DbSet<storing_order> storing_order { get; set; }
        public DbSet<storing_order_tank> storing_order_tank { get; set; }
        public DbSet<customer_company> customer_company { get; set; }
        public DbSet<customer_company_contact_person> customer_company_contact_person { get; set; }

        public DbSet<in_gate> in_gate { get; set; }
        public DbSet<in_gate_survey> in_gate_survey { get; set; }
        public DbSet<cleaning> cleaning { get; set; }
        public DbSet<steaming> steaming { get; set; }
        public DbSet<residue> residue { get; set; }
        public DbSet<repair> repair { get; set; }
        public DbSet<out_gate> out_gate { get; set; }
        public DbSet<out_gate_survey> out_gate_survey { get; set; }
        public DbSet<tariff_cleaning> tariff_depot { get; set; }
        public DbSet<tariff_cleaning> tariff_cleaning { get; set; }
        public DbSet<cleaning_method> cleaning_method { get; set; }
        public DbSet<cleaning_category> cleaning_category { get; set; }

        public DbSet<booking> booking { get; set; }
        public DbSet<release_order> release_order { get; set; } 
        public DbSet<scheduling> scheduling { get; set; }
        public DbSet<scheduling_sot> scheduling_sot { get; set; }
        public DbSet<release_order_sot> release_order_sot { get; set; }

        public DbSet<tank> tank { get; set; }
        public DbSet<tank_info> tank_info { get; set; }
        public DbSet<code_values> code_values { get; set; }
        public DbSet<survey_detail> survey_detail { get; set; }
        public DbSet<job_order> job_order { get; set; }
        public DbSet<currency> currency { get; set; }
        public DbSet<transfer> transfer { get; set; }
        public DbSet<billing_sot> billing_sot { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<in_gate>()
                .Ignore(e => e.haulier);

            modelBuilder.Entity<in_gate_survey>()
                 .Property(e => e.top_coord)
                 .HasColumnType("json"); // Specify the column type as JSON for MySQL

            modelBuilder.Entity<in_gate_survey>()
                 .Property(e => e.bottom_coord)
                 .HasColumnType("json"); // Specify the column type as JSON for MySQL

            modelBuilder.Entity<in_gate_survey>()
                 .Property(e => e.front_coord)
                 .HasColumnType("json"); // Specify the column type as JSON for MySQL

            modelBuilder.Entity<in_gate_survey>()
                 .Property(e => e.rear_coord)
                 .HasColumnType("json"); // Specify the column type as JSON for MySQL

            modelBuilder.Entity<in_gate_survey>()
                 .Property(e => e.left_coord)
                 .HasColumnType("json"); // Specify the column type as JSON for MySQL

            modelBuilder.Entity<in_gate_survey>()
                 .Property(e => e.right_coord)
                 .HasColumnType("json"); // Specify the column type as JSON for MySQL

            //modelBuilder.Entity<billing>()
            //   .HasMany(b => b.repair_customer)
            //   .WithOne(c => c.customer_billing) // Assuming this is the correct navigation
            //   .HasForeignKey(c => c.customer_billing_guid);

            //modelBuilder.Entity<billing>()
            //   .HasMany(b => b.repair_owner)
            //   .WithOne(c => c.owner_billing) // Assuming this is the correct navigation
            //   .HasForeignKey(c => c.owner_billing_guid);

            modelBuilder.Entity<customer_company_cleaning_category>();
            modelBuilder.Entity<tariff_buffer>();
            modelBuilder.Entity<package_buffer>();
            modelBuilder.Entity<tariff_steaming>();
            modelBuilder.Entity<package_steaming>();

        }
    }
}
