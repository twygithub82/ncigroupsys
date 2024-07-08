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

        public DbSet<tank> tank { get; set; }
        public DbSet<InGateWithTank> in_gate { get; set; }
        public DbSet<tariff_cleaning> tariff_cleaning { get; set; }

        public DbSet<cleaning_method> cleaning_method { get; set; }
        public DbSet<cleaning_category> cleaning_category { get; set; }

        public DbSet<BookingWithTanks> booking { get; set; }
        
        public DbSet<code_values> code_values { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<storing_order>(e =>
            {
                e.HasOne(so => so.customer_company).WithMany(cc => cc.storing_orders)
                .HasForeignKey(st => st.customer_company_guid);
            });

            modelBuilder.Entity<storing_order_tank>(e =>
            {
                e.HasOne(tc => tc.tariff_cleaning).WithMany(st => st.sot)
                .HasForeignKey(st => st.last_cargo_guid);

                e.HasOne(st => st.storing_order).WithMany(st => st.storing_order_tank)       // Navigation property in StoringOrderTank
                .HasForeignKey(st => st.so_guid);

            });

            modelBuilder.Entity<customer_company>(e =>
            {
                e.HasMany(c => c.cc_contact_person).WithOne(x => x.customer_company)
                .HasForeignKey(x => x.customer_guid);
            });

            modelBuilder.Entity<tariff_cleaning>(e =>
            {
                //c.HasKey(c => c.guid);
                e.HasOne(so => so.cleaning_method).WithMany(cc => cc.tariff_cleanings)
                .HasForeignKey(st => st.cleaning_method_guid);

                e.HasOne(so => so.cleaning_category).WithMany(cc => cc.tariff_cleanings)
                .HasForeignKey(st => st.cleaning_category_guid);

                e.HasMany(tc => tc.sot).WithOne(st => st.tariff_cleaning)
                .HasForeignKey(st => st.last_cargo_guid);
            });

            modelBuilder.Entity<InGateWithTank>()
                .Ignore(e => e.haulier);

            //modelBuilder.Entity<storing_order_tank>(e =>
            //{
            //    e.HasOne(tc => tc.tariff_cleaning).WithMany(st => st.sot)
            //    .HasForeignKey(st => st.last_cargo_guid);

            //    e.HasOne(st => st.storing_order).WithMany(st => st.storing_order_tank)       // Navigation property in StoringOrderTank
            //    .HasForeignKey(st => st.so_guid);
            //});
        }
    }
}
