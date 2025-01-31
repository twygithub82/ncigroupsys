using IDMS.Models.DB;
using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Package;
using IDMS.Models.Service;
using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Models.Service.GqlTypes.DB
{
    public class ApplicationServiceDBContext : BaseDBContext
    {
        public ApplicationServiceDBContext(DbContextOptions<ApplicationServiceDBContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<aspnetuserroles>()
            .HasKey(sc => new { sc.userID, sc.roleID });

            modelBuilder.Entity<aspnetuserroles>()
                .HasOne(sc => sc.aspnetusers)
                .WithMany(s => s.aspnetuserroles)
                .HasForeignKey(sc => sc.userID);

            modelBuilder.Entity<aspnetuserroles>()
                .HasOne(sc => sc.aspnetroles)
                .WithMany(c => c.aspnetuserroles)
                .HasForeignKey(sc => sc.roleID);

            //// Relationship with customer_billing
            //modelBuilder.Entity<cleaning>()
            //    .HasOne(c => c.customer_billing)
            //    .WithMany(b => b.cleaning) // Assuming billing has no navigation property back to cleaning
            //    .HasForeignKey(c => c.customer_billing_guid);

            //// Relationship with customer_billing
            //modelBuilder.Entity<steaming>()
            //    .HasOne(c => c.customer_billing)
            //    .WithMany(b => b.steaming) // Assuming billing has no navigation property back to cleaning
            //    .HasForeignKey(c => c.customer_billing_guid);

            //// Relationship with customer_billing
            //modelBuilder.Entity<residue>()
            //    .HasOne(c => c.customer_billing)
            //    .WithMany(b => b.residue) // Assuming billing has no navigation property back to cleaning
            //    .HasForeignKey(c => c.customer_billing_guid);

            //// Relationship with customer_billing
            //modelBuilder.Entity<repair>()
            //    .HasOne(c => c.customer_billing)
            //    .WithMany(b => b.repair_customer) // Assuming billing has no navigation property back to cleaning
            //    .HasForeignKey(c => c.customer_billing_guid);

            //// Relationship with customer_billing
            //modelBuilder.Entity<repair>()
            //    .HasOne(c => c.owner_billing)
            //    .WithMany(b => b.repair_owner) // Assuming billing has no navigation property back to cleaning
            //    .HasForeignKey(c => c.owner_billing_guid);

            //// Relationship with customer_billing
            //modelBuilder.Entity<cleaning>()
            //    .HasOne(c => c.owner_billing)
            //    .WithMany(b => b.cleaning) // Assuming billing has no navigation property back to cleaning
            //    .HasForeignKey(c => c.owner_billing_guid);
        }

        public DbSet<currency> currency { get; set; }
        public DbSet<team> team { get; set; }
        public DbSet<job_order> job_order { get; set; }
        public DbSet<time_table> time_table { get; set; }
        public DbSet<aspnetusers> aspnetusers { get; set; }
        public DbSet<aspnetroles> aspnetroles { get; set; }
        public DbSet<aspnetuserroles> aspnetuserroles { get; set; }
        public DbSet<package_repair> package_repair { get; set; }
        public DbSet<package_residue> package_residue { get; set; }
        public DbSet<package_steaming> package_steaming { get; set; }
        public DbSet<storing_order_tank> storing_order_tank { get; set; }
        public DbSet<repair> repair { get; set; }
        public DbSet<repair_part> repair_part { get; set; }
        public DbSet<rp_damage_repair> rp_damage_repair { get; set; }
        public DbSet<residue> residue { get; set; }
        public DbSet<residue_part> residue_part { get; set; }
        public DbSet<cleaning> cleaning { get; set; }
        public DbSet<steaming> steaming { get; set; }
        public DbSet<steaming_part> steaming_part { get; set; }
        public DbSet<steaming_temp> steaming_temp { get; set; }
    }
}
