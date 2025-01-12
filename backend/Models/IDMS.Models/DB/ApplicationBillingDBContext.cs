using IDMS.Models.Billing;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Models.DB
{
    public class ApplicationBillingDBContext : DbContext
    {
        public ApplicationBillingDBContext(DbContextOptions<ApplicationBillingDBContext> options):base(options) 
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<billing> billing { get; set; }
        public DbSet<billing_sot> billing_sot { get; set; }

    }
}
