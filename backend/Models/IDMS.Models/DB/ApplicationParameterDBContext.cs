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

        //public DbSet<IDMS.Models.Parameter.EntityClass_CleaningGroupWithCleanProcedure> cleaning_group { get; set; }
        //public DbSet<IDMS.Models.Parameter.EntityClass_CleaningProcedureWithSteps> cleaning_procedure { get; set; }

        //public DbSet<IDMS.Models.Parameter.EntityClass_CleaningStep> cleaning_steps { get; set; }

        //public DbSet<IDMS.Models.Parameter.EntityClass_CleaningProcedureSteps> cleaning_procedure_steps { get; set; }

        public DbSet<IDMS.Models.Parameter.cleaning_method> cleaning_method { get; set; }

        public DbSet<IDMS.Models.Parameter.cleaning_category> cleaning_category { get; set; }

        public DbSet<IDMS.Models.Master.customer_company> customer_company { get; set; }

        
        public DbSet<IDMS.Models.Package.customer_company_cleaning_category> customer_company_cleaning_category { get; set; }
    }
}
