using IDMS.Models.Billing;
using IDMS.Models.Shared;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Models.DB
{
    public class ApplicationBillingDBContext : BaseDBContext
    {
        public ApplicationBillingDBContext(DbContextOptions<ApplicationBillingDBContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<billing>()
            //   .HasMany(b => b.cleaning)
            //   .WithOne(c => c.customer_billing) // Assuming this is the correct navigation
            //   .HasForeignKey(c => c.customer_billing_guid);

            //// If there’s a second foreign key relationship
            //modelBuilder.Entity<billing>()
            //    .HasMany(b => b.cleaning1)
            //    .WithOne(c => c.owner_billing) // Assuming this is another navigation
            //    .HasForeignKey(c => c.owner_billing_guid);


            //modelBuilder.Entity<billing>()
            //   .HasMany(b => b.steaming)
            //   .WithOne(c => c.customer_billing) // Assuming this is the correct navigation
            //   .HasForeignKey(c => c.customer_billing_guid);

            //modelBuilder.Entity<billing>()
            //   .HasMany(b => b.residue)
            //   .WithOne(c => c.customer_billing) // Assuming this is the correct navigation
            //   .HasForeignKey(c => c.customer_billing_guid);

            //modelBuilder.Entity<billing>()
            //   .HasMany(b => b.repair_customer)
            //   .WithOne(c => c.customer_billing) // Assuming this is the correct navigation
            //   .HasForeignKey(c => c.customer_billing_guid);

            //modelBuilder.Entity<billing>()
            //   .HasMany(b => b.repair_owner)
            //   .WithOne(c => c.owner_billing) // Assuming this is the correct navigation
            //   .HasForeignKey(c => c.owner_billing_guid);
        }

        public DbSet<billing> billing { get; set; }
        public DbSet<billing_sot> billing_sot { get; set; }
        public DbSet<currency> currency { get; set; }
    }
}
