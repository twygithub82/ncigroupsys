using IDMS.StoringOrder.Model.Domain;
using IDMS.StoringOrder.Model.Domain.StoringOrder;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.GqlTypes.Repo
{
    public class BookDbContext: DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options)
          : base(options) { }

        public DbSet<booking> booking { get; set; }
        //public DbSet<storing_order_tank> storing_order_tank { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<storing_order_tank>(e =>
            //{
            //    //e.HasKey(t => t.guid);
            //    e.HasOne(st => st.tariff_cleaning).WithMany(tc => tc.sot)       // Navigation property in StoringOrderTank
            //    .HasForeignKey(st => st.last_cargo_guid);

            //    //e.HasOne(st => st.code_values).WithOne(cv => cv.sot).HasForeignKey<CodeValues>(c => c.CodeValue);
            //});

            base.OnModelCreating(modelBuilder); 
        }

    }
}
