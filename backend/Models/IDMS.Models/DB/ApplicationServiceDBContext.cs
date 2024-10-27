using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Package;
using IDMS.Models.Service;
using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Models.Service.GqlTypes.DB
{
    public class ApplicationServiceDBContext : DbContext
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

        }

        public DbSet<team> team { get; set; }
        public DbSet<job_order> job_order { get; set; }
        public DbSet<time_table> time_table { get; set; }
        public DbSet<aspnetusers> aspnetusers { get; set; }
        public DbSet<aspnetroles> aspnetroles { get; set; }
        public DbSet<aspnetuserroles> aspnetuserroles { get; set; }
        public DbSet<package_repair> package_repair { get; set; }
        public DbSet<storing_order_tank> storing_order_tank { get; set; }
        public DbSet<repair> repair { get; set; }
        public DbSet<repair_est_part> repair_est_part { get; set; }
        public DbSet<rep_damage_repair> rep_damage_repair { get; set; }
        public DbSet<residue> residue { get; set; }
        public DbSet<residue_part> residue_part { get; set; }
        public DbSet<cleaning> cleaning { get; set; }
    }
}
