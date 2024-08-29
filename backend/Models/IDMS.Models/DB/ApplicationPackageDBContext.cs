using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Master;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.DB
{
    public class ApplicationPackageDBContext: DbContext
    {
        public ApplicationPackageDBContext(DbContextOptions<ApplicationPackageDBContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }


        public DbSet<customer_company> customer_company { get; set; }
        public DbSet<IDMS.Models.Parameter.cleaning_category> cleaning_category { get; set; }
        public DbSet<IDMS.Models.Package.customer_company_cleaning_category_with_customer_company> customer_company_cleaning_category { get; set; }

        public DbSet<IDMS.Models.Package.package_depot> package_depot { get; set; }
        public DbSet<IDMS.Models.Package.package_labour> package_labour { get; set; }
        public DbSet<IDMS.Models.Package.package_repair> package_repair { get; set; }
        public DbSet<IDMS.Models.Package.package_residue> package_residue { get; set; }
        public DbSet<IDMS.Models.Package.package_buffer> package_buffer { get; set; }
    }

        
}
