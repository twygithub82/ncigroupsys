using IDMS.FileManagement.Interface.DB;
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
    }
 }
