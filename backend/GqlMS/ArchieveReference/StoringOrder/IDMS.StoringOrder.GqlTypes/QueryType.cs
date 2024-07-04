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
using System.ComponentModel.Design;
using IDMS.StoringOrder.Model.type;
using IDMS.StoringOrder.Model.Type;
using AutoMapper;
using System.ComponentModel;
using System;


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
        public IQueryable<storing_order> GetAllStoringOrders(SODbContext context, [Service] IHttpContextAccessor httpContextAccessor)
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
        public async Task<storing_order> GetStoringOrdersById(string id, SODbContext context, [Service] IHttpContextAccessor httpContextAccessor)
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
        }

        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<customer_company> GetCompany(CusComType customerCompany, SODbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                IQueryable<customer_company> company;
                if (string.IsNullOrEmpty(customerCompany.code))
                {
                    company = context.customer_company;
                }
                else
                    company = context.customer_company.Where(c=>c.code.Contains(customerCompany.code));

                if (company == null)
                {
                    return null;
                }

                return company;
            }
            catch
            {
                throw;
            }
        }

        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<customer_company_contact_person> GetContactPerson(CusComContPersonType ccContactPerson, SODbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                IQueryable<customer_company_contact_person> contactPerson;

                contactPerson = context.customer_company_contact_person;
                    //.Where(c => c.customer_guid == ccContactPerson.customer_guid)
                    //.Where(c => c.name.Contains(ccContactPerson.name));

                //var courseDTO = await context.storing_order.FindAsync(id);

                if (contactPerson == null)
                {
                    return null;
                }

                return contactPerson;
            }
            catch
            {
                throw;
            }
        }

        //[UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<TankUnitType> GetTankUnitType(SODbContext context,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper)
        {
            try
            {
                return context.tank_unit_type.Select(c => new TankUnitType()
                {
                    Guid = c.Guid,
                    UnitType = c.UnitType,
                    Description = c.Description
                });
            }
            catch
            {
                throw;
            }
        }

        [UseProjection]
        //[UseFiltering]
        [UseSorting]
        public IQueryable<CodeValuesType> GetCodeValuesByType(CodeValuesType codeValuesType, SODbContext context,
                [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper)
        {
            try
            {
                var retCodeValues = context.code_values.Where(c => c.CodeValType.Equals(codeValuesType.CodeValType));
                if (retCodeValues.Count() <= 0)
                {
                    throw new GraphQLException(new Error("Code values type not found.", "NOT_FOUND"));
                }

                return retCodeValues.Select(c => new CodeValuesType()
                {
                    Guid = c.Guid,
                    CodeValue = c.CodeValue,
                    CodeValType = c.CodeValType,
                    Description= c.Description,
                    ChildCode = c.ChildCode
                });

            }
            catch
            {
                throw;
            }
        }

        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<CodeValuesType> GetCodeValues(SODbContext context,
        [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper)
        {
            try
            {
                return context.code_values.Select(c => new CodeValuesType()
                {
                    Guid = c.Guid,
                    CodeValue = c.CodeValue,
                    CodeValType = c.CodeValType,
                    Description = c.Description,
                    ChildCode = c.ChildCode,
                });
            }
            catch
            {
                throw;
            }
        }

        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<storing_order_tank> QueryStoringOrderTank(SODbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.storing_order_tank.Where(d => d.delete_dt == null);
                                //.Include(d => d.storing_order);
                                //.Include(d => d.tariff_cleaning)
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
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

    }
}
