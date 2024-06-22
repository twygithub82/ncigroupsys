using IDMS.StoringOrder.Model.Domain;
using IDMS.StoringOrder.Model.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace IDMS.StoringOrder.GqlTypes.Repo
{
    public class SODbContext : DbContext
    {
        public SODbContext(DbContextOptions<SODbContext> options)
            : base(options) { }

        public DbSet<storing_order> storing_order { get; set; }
        public DbSet<customer_company> customer_company { get; set; }
        public DbSet<storing_order_tank> storing_order_tank { get; set; }
        public DbSet<customer_company_contact_person> customer_company_contact_person { get; set; }
        public DbSet<TankUnit> tank_unit_type { get; set; }
        public DbSet<CodeValues> code_values { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<storing_order>(c =>
            {
                c.HasOne(c => c.customer_company).WithMany(cc => cc.storing_orders)
                .HasForeignKey(x => x.customer_company_guid);
            });

            modelBuilder.Entity<customer_company>(c =>
            {
                //c.HasKey(c => c.guid);
                c.HasMany(c => c.cc_contact_person).WithOne(x => x.customer_company)
                .HasForeignKey(x => x.customer_guid);
            });

            modelBuilder.Entity<storing_order_tank>(e =>
            {
                //e.HasKey(t => t.guid);
                e.HasOne(st => st.storing_order).WithMany(st => st.storing_order_tank)       // Navigation property in StoringOrderTank
                .HasForeignKey(st => st.so_guid);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
