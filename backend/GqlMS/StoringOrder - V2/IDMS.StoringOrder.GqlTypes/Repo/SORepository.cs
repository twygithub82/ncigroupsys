using IDMS.StoringOrder.Model.Domain;
using IDMS.StoringOrder.Model.DTOs;
using Microsoft.EntityFrameworkCore;

namespace IDMS.StoringOrder.GqlTypes.Repo
{
    public class SORepository
    {
  
        private readonly IDbContextFactory<SODbContext> _contextFactory;

        public SORepository(IDbContextFactory<SODbContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public async Task<IEnumerable<storing_order>> GetAll()
        {
            using (SODbContext context = _contextFactory.CreateDbContext())
            {
                var ret = await context.storing_order
                    .Include(so=>so.storing_order_tank)
                    .Include(so=> so.customer_company)
                    .ToListAsync();
                return ret;
            }
        }


        public async Task<storing_order> Create(storing_order so)
        {
            using (SODbContext context = _contextFactory.CreateDbContext())
            {
                context.storing_order.Add(so);
                await context.SaveChangesAsync();

                return so;
            }
        }

        //public async Task<SO_type> GetById(string soId)
        //{
        //    using (SODbContext context = _contextFactory.CreateDbContext())
        //    {
        //        return await context.storing_order.FirstOrDefaultAsync(c => c.guid == soId);
        //    }
        //}

        //public async Task<StoringOrdersDTO> Create(StoringOrdersDTO course)
        //{
        //    using (SODbContext context = _contextFactory.CreateDbContext())
        //    {
        //        context.StoringOrders.Add(course);
        //        await context.SaveChangesAsync();

        //        return course;
        //    }
        //}

        //public async Task<CourseDTO> Update(CourseDTO course)
        //{
        //    using (SODbContext context = _contextFactory.CreateDbContext())
        //    {
        //        context.Courses.Update(course);
        //        await context.SaveChangesAsync();

        //        return course;
        //    }
        //}

        //public async Task<bool> Delete(Guid id)
        //{
        //    using (SODbContext context = _contextFactory.CreateDbContext())
        //    {
        //        StoringOrdersDTO course = new StoringOrdersDTO()
        //        {
        //            guid = id
        //        };
        //        context.StoringOrders.Remove(course);

        //        return await context.SaveChangesAsync() > 0;
        //    }
        //}
    }
    
}
