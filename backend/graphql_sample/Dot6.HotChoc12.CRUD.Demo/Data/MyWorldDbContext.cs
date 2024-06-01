using Dot6.HotChoc12.CRUD.Demo.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Dot6.HotChoc12.CRUD.Demo.Data;

public class MyWorldDBContext:DbContext
{
    public MyWorldDBContext(DbContextOptions<MyWorldDBContext> options):base(options)
    {

    }

    public DbSet<Cake> Cake {get;set;}

    //  protected override void OnModelCreating(ModelBuilder modelBuilder) =>
    //     modelBuilder.Entity<Cake>(entity =>
    //     {
    //         entity.ToTable("Cake");
    //         entity.HasKey(e => e.Id);
    //         entity.Property(e => e.Id).HasColumnName("id");
    //         entity.Property(e => e.Name).HasColumnName("Name");
    //         entity.Property(e => e.Price).HasColumnName("Price");
    //         entity.Property(e => e.Description).HasColumnName("Description");
            
    //     });
}