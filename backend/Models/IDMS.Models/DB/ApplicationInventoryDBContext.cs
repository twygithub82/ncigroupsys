using IDMS.Models.Shared;
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
                e.HasOne(st => st.storing_order).WithMany(st => st.storing_order_tank)       // Navigation property in StoringOrderTank
                .HasForeignKey(st => st.so_guid);
            });

            modelBuilder.Entity<storing_order_tank>()
                .HasKey(t => t.guid);

            modelBuilder.Entity<InGateWithTank>()
                .HasKey(e => e.guid);


           
        }

        public DbSet<IDMS.Models.Inventory.InGateWithTank> in_gate { get; set; }
        public DbSet<IDMS.Models.Inventory.storing_order_tank> storing_order_tank { get; set; }

        public DbSet<IDMS.Models.Inventory.storing_order> storing_order { get; set; }

        public DbSet<code_values> code_values { get; set; }

        

    }
}
