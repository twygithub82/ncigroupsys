using IDMS.User.Authentication.API.Models.Authentication;
using IDMS.UserAuthentication.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;

namespace IDMS.UserAuthentication.DB
{
    public class ApplicationDbContext:IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<functions> functions { get; set; }
        public DbSet<role_functions> role_functions { get; set; }
        public DbSet<team> team { get; set; }
        public DbSet<team_user> team_user { get; set; }
        //public DbSet<functions> functions_new { get; set; } 
        public DbSet<user_functions> user_functions { get; set; }
        public DbSet<role> role { get; set; }
        public DbSet<user_role> user_role { get; set; }
        public DbSet<user_license> user_license { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            this.SeedRoles(builder);
        }

        private void SeedRoles(ModelBuilder builder)
        {
            var adminRoleId= Guid.NewGuid().ToString();
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole() { Id= adminRoleId, Name = "Admin", ConcurrencyStamp = "1", NormalizedName = "Admin" },
                new IdentityRole() { Name = "User", ConcurrencyStamp = "2", NormalizedName = "User" },
                new IdentityRole() { Name = "HR", ConcurrencyStamp = "3", NormalizedName = "HR" },
                new IdentityRole() { Name = "Customer", ConcurrencyStamp = "3", NormalizedName = "Customer" }
            );
            var adminUserId = Guid.NewGuid().ToString();
            builder.Entity<ApplicationUser>().HasData(
                new ApplicationUser() { Id= adminUserId, 
                    UserName = "admin", 
                    NormalizedUserName="admin",
                    Email = "admin@dwms.com", 
                    NormalizedEmail = "admin@dwms.com", 
                    EmailConfirmed = true, 
                    PasswordHash = "AQAAAAIAAYagAAAAEAv50U8yR/yGI1IWULZfG4weRGaDIfJHuAqbjhK5CTQJB2FxD6lkxDXsgC3ZMK4fyw==",
                    SecurityStamp = string.Empty,
                    ConcurrencyStamp = "1",
                    isStaff = true
                }
                );

            builder.Entity<IdentityUserRole<string>>().HasData(
                  new IdentityUserRole<string>
                  {
                      UserId = adminUserId,
                      RoleId = adminRoleId // RoleId of the "Admin" role
                  }
              );
        }
    }
}
