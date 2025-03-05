using IDMS.Models.Billing;
using IDMS.Models.DB;
using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Package;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB
{
    public class ApplicationParameterDBContext : BaseDBContext
    {
        public ApplicationParameterDBContext(DbContextOptions<ApplicationParameterDBContext> options):base(options) 
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<billing>()
            //   .HasMany(b => b.repair_customer)
            //   .WithOne(c => c.customer_billing) // Assuming this is the correct navigation
            //   .HasForeignKey(c => c.customer_billing_guid);

            //modelBuilder.Entity<billing>()
            //   .HasMany(b => b.repair_owner)
            //   .WithOne(c => c.owner_billing) // Assuming this is the correct navigation
            //   .HasForeignKey(c => c.owner_billing_guid);

            modelBuilder.Entity<customer_company>()
                .HasKey(e => e.guid);


            modelBuilder.Entity<cleaning_category>()
                .HasKey(e => e.guid);

            modelBuilder.Entity<cleaning_method>()
                .HasKey(e => e.guid);

        }

        public DbSet<cleaning_method> cleaning_method { get; set; }
        public DbSet<cleaning_category> cleaning_category { get; set; }
        public DbSet<cleaning_formula> cleaning_formula { get; set; }
        public DbSet<cleaning_method_formula> cleaning_method_formula { get; set; }
        public DbSet<customer_company> customer_company { get; set; }
        public DbSet<customer_company_cleaning_category> customer_company_cleaning_category { get; set; }
    }
}
