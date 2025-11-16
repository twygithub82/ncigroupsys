using IDMS.Models.Billing;
using IDMS.Models.DB;
using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Package;
using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Models.Tariff.Cleaning.GqlTypes.DB
{
    public class ApplicationTariffDBContext : BaseDBContext
    {
        public ApplicationTariffDBContext(DbContextOptions<ApplicationTariffDBContext> options) : base(options)
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

            modelBuilder.Entity<storing_order_tank>(e =>
            {
                //e.HasKey(t => t.guid);
                // e.Ignore("tariff_cleaning");
                e.HasOne(st => st.storing_order).WithMany(st => st.storing_order_tank)       // Navigation property in StoringOrderTank
                .HasForeignKey(st => st.so_guid);
            });

            modelBuilder.Entity<tariff_cleaning>()
                .ToTable("tariff_cleaning")
                .HasMany(e => e.sot).WithOne(e => e.tariff_cleaning)
                .HasForeignKey(e=>e.last_cargo_guid) ;
        }

        
        public DbSet<currency> currency { get; set; }
        public DbSet<IDMS.Models.Parameter.cleaning_method> cleaning_method { get; set; }
        public DbSet<IDMS.Models.Parameter.cleaning_category> cleaning_category { get; set; }
        
        public DbSet<customer_company_cleaning_category> customer_company_cleaning_category { get; set; }
        public DbSet<customer_company> customer_company { get; set; }

        public DbSet<storing_order> storing_order { get; set; }
        public DbSet<storing_order_tank> storing_order_tank { get; set; }

        public DbSet<tariff_cleaning> tariff_cleaning { get; set; }
        public DbSet<tariff_depot> tariff_depot { get; set; }
        public DbSet<tariff_buffer> tariff_buffer { get; set; }
        public DbSet<tariff_labour> tariff_labour { get; set; }
        public DbSet<tariff_residue> tariff_residue { get; set; }
        public DbSet<tariff_repair> tariff_repair { get; set; }
        public DbSet<tariff_steaming> tariff_steaming { get; set; }
        public DbSet<steaming_exclusive> steaming_exclusive { get; set; }

        public DbSet<package_depot> package_depot { get; set; }
        public DbSet<package_residue> package_residue { get; set; }
        public DbSet<package_labour> package_labour { get; set; }
        public DbSet<package_buffer> package_buffer { get; set; }
        public DbSet<package_repair> package_repair { get; set; }
        public DbSet<package_steaming> package_steaming { get; set; }

        public DbSet<tank> tank { get; set; }
        public DbSet<un_number> un_number { get; set; }

    }
}
