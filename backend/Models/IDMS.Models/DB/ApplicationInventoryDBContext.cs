using IDMS.Models.Master;
using IDMS.Models.Parameter;
using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Models.Inventory.InGate.GqlTypes.DB
{
    public class ApplicationInventoryDBContext : DbContext
    {
        public ApplicationInventoryDBContext(DbContextOptions<ApplicationInventoryDBContext> options) : base(options)
        {
            
        }

        public DbSet<storing_order> storing_order { get; set; }
        public DbSet<storing_order_tank> storing_order_tank { get; set; }

        public DbSet<customer_company> customer_company { get; set; }
        public DbSet<customer_company_contact_person> customer_company_contact_person { get; set; }

        public DbSet<InGateWithTank> in_gate { get; set; }
        public DbSet<in_gate_survey> in_gate_survey { get; set; }
        public DbSet<tariff_cleaning> tariff_cleaning { get; set; }

        public DbSet<CleaningMethodWithTariff> cleaning_method { get; set; }

        public DbSet<CleaningCategoryWithTariff> cleaning_category { get; set; }


        public DbSet<booking> booking { get; set; }
        public DbSet<release_order> release_order { get; set; } 
        public DbSet<scheduling> scheduling { get; set; }
        public DbSet<scheduling_sot> scheduling_sot { get; set; }
        public DbSet<release_order_sot> release_order_sot { get; set; }

        public DbSet<tank> tank { get; set; }
        public DbSet<code_values> code_values { get; set; }
        public DbSet<surveyor> surveyor { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<InGateWithTank>()
                .Ignore(e => e.haulier);
        }
    }
}
