using IDMS.Models.Billing;
using IDMS.Models.Inventory;
using IDMS.Models.Shared;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.DB
{
    public class BaseDBContext : DbContext
    {
        public BaseDBContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<billing>()
               .HasMany(b => b.repair_customer)
               .WithOne(c => c.customer_billing) // Assuming this is the correct navigation
               .HasForeignKey(c => c.customer_billing_guid);

            modelBuilder.Entity<billing>()
               .HasMany(b => b.repair_owner)
               .WithOne(c => c.owner_billing) // Assuming this is the correct navigation
               .HasForeignKey(c => c.owner_billing_guid);

            modelBuilder.Entity<billing>()
               .HasMany(b => b.loff_billing_sot)
               .WithOne(c => c.loff_billing) // Assuming this is the correct navigation
               .HasForeignKey(c => c.loff_billing_guid);

            modelBuilder.Entity<billing>()
               .HasMany(b => b.lon_billing_sot)
               .WithOne(c => c.lon_billing) // Assuming this is the correct navigation
               .HasForeignKey(c => c.lon_billing_guid);

            modelBuilder.Entity<billing>()
               .HasMany(b => b.preinsp_billing_sot)
               .WithOne(c => c.preinsp_billing) // Assuming this is the correct navigation
               .HasForeignKey(c => c.preinsp_billing_guid);

            modelBuilder.Entity<billing>()
               .HasMany(b => b.storage_billing_sot)
               .WithOne(c => c.storage_billing) // Assuming this is the correct navigation
               .HasForeignKey(c => c.storage_billing_guid);

            modelBuilder.Entity<billing>()
               .HasMany(b => b.gin_billing_sot)
               .WithOne(c => c.gin_billing) // Assuming this is the correct navigation
               .HasForeignKey(c => c.gin_billing_guid);

            modelBuilder.Entity<billing>()
               .HasMany(b => b.gout_billing_sot)
               .WithOne(c => c.gout_billing) // Assuming this is the correct navigation
               .HasForeignKey(c => c.gout_billing_guid);

            modelBuilder.Entity<storing_order_tank>()
             .HasOne(s => s.tank_info)              // Sot has one TankInfo
             .WithMany(t => t.storing_order_tank)                  // TankInfo has one Sot
             .HasForeignKey(s => s.tank_no)    // Foreign Key in Sot
             .HasPrincipalKey(t => t.tank_no);

            // Ensure that TankNo in TankInfo is unique
            modelBuilder.Entity<tank_info>()
                .HasIndex(t => t.tank_no)
                .IsUnique();  // Ensure that TankNo is unique in TankInfo
        }
    }
}
