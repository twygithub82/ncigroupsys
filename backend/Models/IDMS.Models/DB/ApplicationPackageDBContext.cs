using IDMS.Models.Billing;
using IDMS.Models.Master;
using IDMS.Models.Package;
using IDMS.Models.Parameter;
using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.DB
{
    public class ApplicationPackageDBContext: BaseDBContext
    {
        public ApplicationPackageDBContext(DbContextOptions<ApplicationPackageDBContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<billing>()
            //   .HasMany(b => b.repair_customer)
            //   .WithOne(c => c.customer_billing) // Assuming this is the correct navigation
            //   .HasForeignKey(c => c.customer_billing_guid);

            //modelBuilder.Entity<billing>()
            //   .HasMany(b => b.repair_owner)
            //   .WithOne(c => c.owner_billing) // Assuming this is the correct navigation
            //   .HasForeignKey(c => c.owner_billing_guid);
        }


        public DbSet<customer_company> customer_company { get; set; }
        public DbSet<cleaning_category> cleaning_category { get; set; }
        public DbSet<customer_company_cleaning_category> customer_company_cleaning_category { get; set; }
        public DbSet<package_depot> package_depot { get; set; }
        public DbSet<package_labour> package_labour { get; set; }
        public DbSet<package_repair> package_repair { get; set; }
        public DbSet<package_residue> package_residue { get; set; }
        public DbSet<package_buffer> package_buffer { get; set; }
        public DbSet<package_steaming> package_steaming { get; set; }
        public DbSet<steaming_exclusive> steaming_exclusive { get; set; }
        public DbSet<tariff_repair> tariff_repair { get; set; } 
    }

        
}
