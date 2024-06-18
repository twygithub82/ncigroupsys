using Dot6.HotChoc12.CRUD.Demo.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Dot6.HotChoc12.CRUD.Demo.Data;

public class MyWorldDBContext : DbContext
{
    public MyWorldDBContext(DbContextOptions<MyWorldDBContext> options) : base(options)
    {

    }

    public DbSet<Cake> Cake { get; set; }

    public DbSet<shape> Shape { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<shape>()
        .HasKey(shape => shape.Id);

        modelBuilder.Entity<Cake>(entity =>
        {
            //entity.ToTable("Cake");
            entity.HasKey(e => e.Id);
            //entity.Property(e => e.Id).HasColumnName("id");
            //entity.Property(e => e.Name).HasColumnName("Name"); 
            //entity.Property(e => e.Price).HasColumnName("Price");
            //entity.Property(e => e.Description).HasColumnName("Description");
            entity.HasMany<shape>()
            //entity.HasOne<Cake>()
            .WithOne(x => x.cake);
            //base.OnModelCreating(modelBuilder);
        });

        modelBuilder.Entity<shape>(entity =>
        {
            //entity.ToTable("Cake");
            //entity.HasKey(e => e.Id);
            //entity.Property(e => e.Id).HasColumnName("id");
            //entity.Property(e => e.Name).HasColumnName("Name"); 
            //entity.Property(e => e.Price).HasColumnName("Price");
            //entity.Property(e => e.Description).HasColumnName("Description");
            entity.HasOne<Cake>()
            //entity.HasOne<Cake>()
            .WithMany(x => x.Shape);
            //base.OnModelCreating(modelBuilder);
        });
    }
}