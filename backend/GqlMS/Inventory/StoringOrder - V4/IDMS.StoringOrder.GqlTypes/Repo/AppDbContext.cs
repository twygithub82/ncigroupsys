using IDMS.StoringOrder.Model.Domain;
using IDMS.StoringOrder.Model.Domain.Customer;
using IDMS.StoringOrder.Model.Domain.StoringOrder;
using Microsoft.EntityFrameworkCore;

namespace IDMS.StoringOrder.GqlTypes.Repo
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<storing_order> storing_order { get; set; }
        public DbSet<customer_company> customer_company { get; set; }
        public DbSet<storing_order_tank> storing_order_tank { get; set; }
        public DbSet<customer_company_contact_person> customer_company_contact_person { get; set; }
        public DbSet<tank> tank_unit_type { get; set; }
        public DbSet<code_values> code_values { get; set; }
        public DbSet<tariff_cleaning> tariff_cleaning { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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
                //e.HasKey(t => t.guid);
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
