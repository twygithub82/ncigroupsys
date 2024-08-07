using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Package;
using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Models.Tariff.Cleaning.GqlTypes.DB
{
    public class ApplicationTariffDBContext : DbContext
    {
        public ApplicationTariffDBContext(DbContextOptions<ApplicationTariffDBContext> options) : base(options)
        {


        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<InGateWithTank>()
                 //.Ignore(e => e.haulier)
                 //.Ignore(e => e.eir_doc)
                 //.HasOne(e => e.tank).WithMany(t => t.in_gate)
                 //.HasForeignKey<InGateWithTank>(t => t.so_tank_guid);

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


            //modelBuilder.Entity<tariff_depot>()
            //   .ToTable("tariff_depot")
            //   .HasMany(e => e.tanks).WithOne(e => e.tariff_depot)
            //   .HasForeignKey(e => e.tariff_depot_guid);

            //modelBuilder.Entity<tariff_cleaning>()
            //    .ToTable("tariff_cleaning")
            //    .HasOne(t => t.cleaning_method).WithMany(m => m.tariff_cleanings)
            //    .HasForeignKey(f => f.cleaning_method_guid);

            //modelBuilder.Entity<tariff_cleaning>()
            //    .ToTable("tariff_cleaning")
            //    .HasOne(t => t.cleaning_category).WithMany(m => m.tariff_cleanings)
            //    .HasForeignKey(f => f.cleaning_category_guid);

        }

        public DbSet<IDMS.Models.Tariff.tariff_cleaning> tariff_cleaning { get; set; }

        public DbSet<IDMS.Models.Parameter.CleaningMethodWithTariff> cleaning_method { get; set; }

        public DbSet<IDMS.Models.Parameter.CleaningCategoryWithTariff> cleaning_category { get; set; }
        
        public DbSet<IDMS.Models.Package.customer_company_cleaning_category> customer_company_cleaning_category { get; set; }
        public DbSet<IDMS.Models.Master.customer_company> customer_company { get; set; }

        public DbSet<IDMS.Models.Inventory.storing_order> storing_order { get; set; }

        public DbSet<IDMS.Models.Inventory.storing_order_tank> storing_order_tank { get; set; }

        public DbSet<IDMS.Models.Tariff.tariff_depot> tariff_depot { get; set; }

        public DbSet<IDMS.Models.Package.package_depot> package_depot { get; set; }
        public DbSet<IDMS.Models.Shared.tank> tank { get; set; }

    }
}
