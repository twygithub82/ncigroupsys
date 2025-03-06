using IDMS.Models.Billing;
using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Service;
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
        public DbSet<storing_order_tank> storing_order_tank { get; set; }
        public DbSet<storing_order> storing_order { get; set; }
        public DbSet<customer_company> customer_company { get; set; }
        public DbSet<cleaning> cleaning { get; set; }
        public DbSet<repair> repair { get; set; }
        public DbSet<repair_part> repair_part { get; set; }
        public DbSet<job_order> job_order { get; set; }
        public DbSet<team> team { get; set; }
        public DbSet<in_gate> in_gate { get; set; }
        public DbSet<out_gate> out_gate { get; set; }
        public DbSet<tank_info> tank_info { get; set; }
        public DbSet<survey_detail> survey_detail { get; set; }
        public DbSet<code_values> code_values { get; set; }
        public DbSet<steaming> steaming {  get; set; }
        //public DbSet<steaming> steaming { get; set; }

    }
}
