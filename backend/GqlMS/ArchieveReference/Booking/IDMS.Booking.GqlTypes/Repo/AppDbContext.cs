using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Booking.GqlTypes.Repo
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<booking> booking { get; set; }
        public DbSet<storing_order> storing_order { get; set; }
        public DbSet<storing_order_tank> storing_order_tank { get; set; }
        public DbSet<customer_company> customer_company { get; set; }
        public DbSet<customer_company_contact_person> customer_company_contact_person { get; set; }
        public DbSet<tank> tank { get; set; }
        public DbSet<InGateWithTank> in_gate { get; set; }
        public DbSet<code_values> code_values { get; set; }
        public DbSet<tariff_cleaning> tariff_cleaning { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            //modelBuilder.Entity<BookingWithTanks>(c =>
            //{
            //    c.HasOne(c => c.storing_order_tank).WithOne(s => s.)
            //    .HasForeignKey<booking>(c => c.sot_guid);
            //});

            modelBuilder.Entity<storing_order>(c =>
            {
                c.HasOne(c => c.customer_company).WithMany(cc => cc.storing_orders)
                .HasForeignKey(x => x.customer_company_guid)
                .IsRequired();
            });

            modelBuilder.Entity<customer_company>(e =>
            {
                e.HasMany(c => c.cc_contact_person).WithOne(x => x.customer_company)
                .HasForeignKey(x => x.customer_guid);
            });

            modelBuilder.Entity<storing_order_tank>(e =>
            {
                //e.HasOne(e => e.booking).WithOne(b => b.storing_order_tank).HasForeignKey<BookingWithTanks>(t => t.sot_guid);
                e.HasOne(t => t.in_gate).WithOne(t => t.tank).HasForeignKey<InGateWithTank>(t => t.so_tank_guid);
                e.HasOne(st => st.storing_order).WithMany(st => st.storing_order_tank)       // Navigation property in StoringOrderTank
                .HasForeignKey(st => st.so_guid);
            });

            modelBuilder.Entity<tariff_cleaning>(e =>
            {
                //c.HasKey(c => c.guid);
                e.HasMany(tc => tc.sot).WithOne(st => st.tariff_cleaning)
                .HasForeignKey(st => st.last_cargo_guid);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
