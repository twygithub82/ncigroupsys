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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<InGateWithTank>()
                .Ignore(e=>e.haulier )
                .Ignore(e => e.eir_doc)
                .HasOne(e => e.tank).WithOne(t => t.in_gate)
                .HasForeignKey<InGateWithTank>(t => t.so_tank_guid);

            modelBuilder.Entity<storing_order_tank>(e =>
            {
                //e.HasKey(t => t.guid);
               // e.Ignore("tariff_cleaning");
                e.HasOne(st => st.storing_order).WithMany(st => st.storing_order_tank)       // Navigation property in StoringOrderTank
                .HasForeignKey(st => st.so_guid);
            });

            modelBuilder.Entity<storing_order_tank>()

                //c.HasKey(c => c.guid);
                
                .HasOne(tc => tc.tariff_cleaning).WithMany(st => st.sot)
                .HasForeignKey(st => st.last_cargo_guid);
           

            modelBuilder.Entity<storing_order>(e =>
            {
                //c.HasKey(c => c.guid);
                e.HasOne(so => so.customer_company).WithMany(cc => cc.storing_orders)
                .HasForeignKey(st => st.customer_company_guid);
            });

            modelBuilder.Entity<tariff_cleaning>(e =>
            {
                //c.HasKey(c => c.guid);
                e.HasOne(so => so.cleaning_method).WithMany(cc => cc.tariff_cleanings)
                .HasForeignKey(st => st.cleaning_method_guid);
            });

            modelBuilder.Entity<tariff_cleaning>(e =>
            {
                //c.HasKey(c => c.guid);
                e.HasOne(so => so.cleaning_category).WithMany(cc => cc.tariff_cleanings)
                .HasForeignKey(st => st.cleaning_category_guid);
            });

            modelBuilder.Entity<storing_order_tank>()
                .HasKey(t => t.guid);

            modelBuilder.Entity<InGateWithTank>()
                .HasKey(e => e.guid);


           
        }

        public DbSet<IDMS.Models.Inventory.InGateWithTank> in_gate { get; set; }
        public DbSet<IDMS.Models.Inventory.storing_order_tank> storing_order_tank { get; set; }

        public DbSet<IDMS.Models.Tariff.tariff_cleaning> tariff_cleaning { get; set; }
        public DbSet<IDMS.Models.Inventory.storing_order> storing_order { get; set; }
        public DbSet<IDMS.Models.Parameter.cleaning_method> cleaning_method { get; set; }
        public DbSet<IDMS.Models.Parameter.cleaning_category> cleaning_category { get; set; }
        public DbSet<IDMS.Models.Master.customer_company> customer_company { get; set; }
        public DbSet<code_values> code_values { get; set; }

        

    }
}
