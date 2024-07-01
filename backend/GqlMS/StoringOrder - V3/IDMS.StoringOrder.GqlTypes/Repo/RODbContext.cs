using IDMS.StoringOrder.Model.Domain;
using IDMS.StoringOrder.Model.Domain.ReleaseOrder;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.GqlTypes.Repo
{
    public class RODbContext : DbContext
    {
        public RODbContext(DbContextOptions<RODbContext> options)
          : base(options) { }

        public DbSet<release_order> release_order { get; set; }

    }
}
