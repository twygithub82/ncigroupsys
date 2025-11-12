using IDMS.FileManagement.Interface.DB;
using IDMS.FileManagement.Interface.Model;
using Microsoft.EntityFrameworkCore;

namespace IDMS.FileManagement.Interface
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<file_management> file_management { get; set; }
        public DbSet<email_job> email_job { get; set; }
        public DbSet<daily_tank_activity_result> daily_tank_activity_result { get; set; }
        public DbSet<customer_companay> customer_company { get; set; }
    }
 }
