using IDMS.Models.Billing;
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
               .HasMany(b => b.lolo_billing_sot)
               .WithOne(c => c.lolo_billing) // Assuming this is the correct navigation
               .HasForeignKey(c => c.lolo_billing_guid);

            modelBuilder.Entity<billing>()
               .HasMany(b => b.preinsp_billing_sot)
               .WithOne(c => c.preinsp_billing) // Assuming this is the correct navigation
               .HasForeignKey(c => c.preinsp_billing_guid);

            modelBuilder.Entity<billing>()
               .HasMany(b => b.storage_billing_sot)
               .WithOne(c => c.storage_billing) // Assuming this is the correct navigation
               .HasForeignKey(c => c.storage_billing_guid);

            modelBuilder.Entity<billing>()
               .HasMany(b => b.gateio_billing_sot)
               .WithOne(c => c.gateio_billing) // Assuming this is the correct navigation
               .HasForeignKey(c => c.gateio_billing_guid);
        }
    }
}
