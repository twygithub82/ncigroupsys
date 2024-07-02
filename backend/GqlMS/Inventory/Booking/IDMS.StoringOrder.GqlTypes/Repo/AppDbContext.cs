using IDMS.Models.Inventory;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Booking.GqlTypes.Repo
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<booking> booking { get; set; }
        //public DbSet<storing_order_tank> storing_order_tank { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<storing_order>(c =>
            //{
            //    c.HasOne(c => c.customer_company).WithMany(cc => cc.storing_orders)
            //    .HasForeignKey(x => x.customer_company_guid);
            //});

            //modelBuilder.Entity<customer_company>(e =>
            //{
            //    //c.HasKey(c => c.guid);
            //    e.HasMany(c => c.cc_contact_person).WithOne(x => x.customer_company)
            //    .HasForeignKey(x => x.customer_guid);
            //});

            //modelBuilder.Entity<storing_order_tank>(e =>
            //{
            //    //e.HasKey(t => t.guid);
            //    e.HasOne(st => st.storing_order).WithMany(st => st.storing_order_tank)       // Navigation property in StoringOrderTank
            //    .HasForeignKey(st => st.so_guid);
            //});

            //modelBuilder.Entity<tariff_cleaning>(e =>
            //{
            //    //c.HasKey(c => c.guid);
            //    e.HasMany(tc => tc.sot).WithOne(st => st.tariff_cleaning)
            //    .HasForeignKey(st => st.last_cargo_guid);
            //});

            base.OnModelCreating(modelBuilder);
        }
    }
}
