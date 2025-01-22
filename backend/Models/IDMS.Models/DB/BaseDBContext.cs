using IDMS.Models.Billing;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.DB
{
    //public class BaseDBContext : DbContext
    //{

    //    protected override void OnModelCreating(ModelBuilder modelBuilder)
    //    {
    //        base.OnModelCreating(modelBuilder);

    //        modelBuilder.Entity<billing>()
    //           .HasMany(b => b.repair_customer)
    //           .WithOne(c => c.customer_billing) // Assuming this is the correct navigation
    //           .HasForeignKey(c => c.customer_billing_guid);

    //        modelBuilder.Entity<billing>()
    //           .HasMany(b => b.repair_owner)
    //           .WithOne(c => c.owner_billing) // Assuming this is the correct navigation
    //           .HasForeignKey(c => c.owner_billing_guid);
    //    }
    //}
}
