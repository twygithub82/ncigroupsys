using IDMS.Models.Master;
using IDMS.Models.Package;
using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Models.Tariff.Cleaning.GqlTypes.DB
{
    public class ApplicationTariffDBContext : DbContext
    {
        public ApplicationTariffDBContext(DbContextOptions<ApplicationTariffDBContext> options) : base(options)
        {


        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<EntityClass_TariffCleaning>()
                .ToTable("tariff_cleaning")
                .HasOne(t => t.cleaning_method).WithMany(m => m.tariff_cleanings)
                .HasForeignKey(f => f.cleaning_method_guid);

            modelBuilder.Entity<EntityClass_TariffCleaning>()
                .ToTable("tariff_cleaning")
                .HasOne(t => t.cleaning_category).WithMany(m => m.tariff_cleanings)
                .HasForeignKey(f => f.cleaning_category_guid);
            //modelBuilder.Entity<EntityClass_TariffCleaning>()
            //    .HasOne(e => e.cleaning_method).WithOne(t => t.tariff_cleaning )
            //    .HasForeignKey<EntityClass_TariffCleaning>(t => t.cleaning_method_guid);

            //modelBuilder.Entity<EntityClass_CustomerCompany_TariffCleaning>()
            //    .HasOne (i=>i.customer_company).WithMany(i=>i.package_cleaning)
            //    .HasForeignKey(t=>t.customer_company_guid);

            //modelBuilder.Entity<EntityClass_CustomerCompany_TariffCleaning>()
            //   .HasOne(i => i.tariff_cleaning ).WithMany(i => i.customer_company_tariff_clean)
            //   .HasForeignKey<EntityClass_CustomerCompany_TariffCleaning>(t => t.tariff_cleaning_guid);
        }

        public DbSet<IDMS.Models.Tariff.EntityClass_TariffCleaning> tariff_cleaning { get; set; }

        public DbSet<IDMS.Models.Parameter.EntityClass_CleaningMethodWithTariff> cleaning_method { get; set; }

        public DbSet<IDMS.Models.Parameter.EntityClass_CleaningCategoryWithTariff> cleaning_category { get; set; }
        
        public DbSet<IDMS.Models.Package.EntityClass_CustomerCompany_CleaningCategory> customer_company_cleaning_category { get; set; }
        public DbSet<IDMS.Models.Master.EntityClass_CustomerCompany> customer_company { get; set; }

    }
}
