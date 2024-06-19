using IDMS.Models.Inventory;
using Microsoft.EntityFrameworkCore;
 
namespace IDMS.InGate.DB
{
    public class ApplicationDBContext:DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options):base(options)
        {
            

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<EntityClass_InGateWithTank>()
                .HasOne(e => e.tank)
                .WithOne(t => t.in_gate)
                .HasForeignKey<EntityClass_InGateWithTank>(t => t.so_tank_guid);
                

            modelBuilder.Entity<EntityClass_Tank>()
                .HasKey(t => t.guid);

            modelBuilder.Entity<EntityClass_InGateWithTank>()
                .HasKey(e => e.guid);

        }

        public DbSet<IDMS.Models.Inventory.EntityClass_InGateWithTank> in_gate { get; set; }
        public DbSet<IDMS.Models.Inventory.EntityClass_Tank> storing_order_tank { get; set; }

    }
}
