using IDMS.Models.Inventory;
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

            modelBuilder.Entity<EntityClass_InGateWithTank>()
                .Ignore(e=>e.haulier )
                .Ignore(e => e.eir_doc)
                .HasOne(e => e.tank).WithOne(t => t.in_gate)
                .HasForeignKey<EntityClass_InGateWithTank>(t => t.so_tank_guid);

            modelBuilder.Entity<EntityClass_Tank>(e =>
            {
                //e.HasKey(t => t.guid);
                e.HasOne(st => st.storing_order).WithMany(st => st.storing_order_tank)       // Navigation property in StoringOrderTank
                .HasForeignKey(st => st.so_guid);
            });

            modelBuilder.Entity<EntityClass_Tank>()
                .HasKey(t => t.guid);

            modelBuilder.Entity<EntityClass_InGateWithTank>()
                .HasKey(e => e.guid);


           
        }

        public DbSet<IDMS.Models.Inventory.EntityClass_InGateWithTank> in_gate { get; set; }
        public DbSet<IDMS.Models.Inventory.EntityClass_Tank> storing_order_tank { get; set; }

        public DbSet<IDMS.Models.Inventory.EntityClass_StoringOrder> storing_order { get; set; }

        public DbSet<IDMS.Models.Inventory.EntityClass_CodeValues> code_values { get; set; }

        

    }
}
