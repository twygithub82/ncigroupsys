using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore;
using System.Xml;

namespace IDMS.StoringOrder.GqlTypes.Repo
{
    public class AppDbContext : DbContext
    {
        
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }


        public override async Task<int>  SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entities = ChangeTracker.Entries<storing_order>()
                .Where(e => e.State == EntityState.Added)
                .Select(e => e.Entity);

            foreach (var entity in entities)
            {
                int rowCount = storing_order.Count();
                entity.so_no = $"SO{(rowCount + 1).ToString().PadLeft(6, '0')}";
            }

            return await base.SaveChangesAsync(cancellationToken);
        }

        public DbSet<storing_order> storing_order { get; set; }
        public DbSet<customer_company> customer_company { get; set; }
        public DbSet<storing_order_tank> storing_order_tank { get; set; }
        public DbSet<customer_company_contact_person> customer_company_contact_person { get; set; }
        public DbSet<tank> tank { get; set; }
        public DbSet<InGateWithTank> in_gate { get; set; }
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
                //e.Ignore(e => e.in_gate);

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

            modelBuilder.Entity<InGateWithTank>()
                .Ignore(i => i.haulier);
            //{
            //    e.HasKey(e => e.guid);
            //    e.Ignore(e => e.tank);
            //    //.HasDiscriminator().HasValue(typeof(InGateWithTank), "tank");
            //});

            base.OnModelCreating(modelBuilder);
        }
    }
}
