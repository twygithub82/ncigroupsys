using HotChocolate;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using System.Net;
using CommonUtil.Core.Service;
using System.Runtime.CompilerServices;
using IDMS.DBAccess.Interface;
using IDMS.StoringOrder.Model;
using IDMS.StoringOrder.Model.DTOs;
using IDMS.StoringOrder.GqlTypes.Repo;
using Microsoft.EntityFrameworkCore;
using HotChocolate.Types;
using IDMS.StoringOrder.Model.Domain;
using Microsoft.AspNetCore.Http;


namespace IDMS.StoringOrder.GqlTypes
{
    public class QueryType
    {
        private readonly IDBAccess _dbAccess;
        //private readonly SORepository _sORepository;

        public QueryType([Service] IDBAccess dBAccess)
        {
            _dbAccess = dBAccess;
            //_sORepository = sORepository;
        }

        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<SO_type> QueryAllStoringOrders(SODbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            var result = context.storing_order
                 .Include(so => so.storing_order_tank)
                 .Include(so => so.customer_company);

            if(result != null)
            {
                return result;
            }
            
            return null;
        }


        //[UseDbContext(typeof(SODbContext))]
        public async Task<SO_type> GetCourseByIdAsync(string id, SODbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var courseDTO = context.storing_order
                    .Include(so => so.storing_order_tank)
                    .Include(so => so.customer_company)
                    .FirstOrDefaultAsync(c => c.guid == id).Result;

                //var courseDTO = await context.storing_order.FindAsync(id);

                if (courseDTO == null)
                {
                    return null;
                }

                return courseDTO;
            }
            catch
            {
                throw;
            }

            //return new CourseType()
            //{
            //    Id = courseDTO.Id,
            //    Name = courseDTO.Name,
            //    Subject = courseDTO.Subject,
            //    InstructorId = courseDTO.InstructorId,
            //    CreatorId = courseDTO.CreatorId
            //};
        }


        //[UseDbContext(typeof(SODbContext))]
        //public IQueryable<StoringOrdersDTO> GetCourses([ScopedService] SODbContext context)
        //{

        //    context.StoringOrders.G

        //    return context.StoringOrders.Select(c => new StoringOrdersDTO()
        //    {
        //         g


        //    });
        //}


        //public async Task<List<CodeValues>> QueryCodeValues(CodeValues codeValues)
        //{

        //    List<CodeValues> codeValuesList = new List<CodeValues>();
        //    return codeValuesList;
        //    //Query code value table and return as a list

        //}



        //public async Task<StoringOder> QueryStoringOrderById(StoringOder so)
        //{
        //    var guid = so.guid;

        //    //var order = await _dbAccess.GetDataByIdAsync<StoringOder>(soNo, "storing_order");
        //    //if (order == null)
        //    //{
        //    //    throw new GraphQLException(new Error("storing order not found", "NOT_FOUND"));
        //    //}
        //    //return order;
        //    return null;
        //}

        //public async Task<List<StoringOrderTank>> QueryStoringOrderTankBySOId(StoringOrderTank sot)
        //{
        //    var guid = sot.so_guid;
        //    //Select Storing Ordrt Tank table n join  tarif cleaning table
        //    //var order = await _dbAccess.GetDataByIdAsync<StoringOder>(soNo, "storing_order");
        //    //if (order == null)
        //    //{
        //    //    throw new GraphQLException(new Error("storing order not found", "NOT_FOUND"));
        //    //}
        //    //return order;
        //    return null;
        //}


        ///// <summary>
        ///// This is dummy data test function
        ///// </summary>
        ///// <returns></returns>
        //public Book AllBooks()
        //{
        //    return new Book
        //    {
        //        Title = "C# in depth.",
        //        Author = new Author
        //        {
        //            Name = "Jon Skeet"
        //        }
        //    };
        //}

        ///// <summary>
        ///// This is dummy data test function
        ///// </summary>
        ///// <returns></returns>
        //public Cake GiveMeCakes()
        //{
        //    return new Cake
        //    {
        //        Description = "This is new cake for the month",
        //        Id = 001,
        //        Name = "April Cake",
        //        Price = 12
        //    };
        //}

        public Cake GetMeCakes()
        {
            return new Cake
            {
                Description = "This is new cake for the month",
                Id = 001,
                Name = "April Cake dkljflksd",
                Price = 12
            };
        }
    }
}
