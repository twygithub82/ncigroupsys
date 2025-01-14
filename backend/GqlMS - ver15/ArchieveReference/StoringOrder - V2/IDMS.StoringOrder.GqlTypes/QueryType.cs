using HotChocolate;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using CommonUtil.Core.Service;
using System.Runtime.CompilerServices;
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
using IDMS.StoringOrder.Model.CustomSorter;
using Microsoft.EntityFrameworkCore.Query;
using HotChocolate.Resolvers;


namespace IDMS.StoringOrder.GqlTypes
{
    public class QueryType
    {
        [UsePaging(IncludeTotalCount = true , DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting(typeof(SOSorter))]
        public IQueryable<storing_order> GetAllStoringOrders(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.storing_order.Where(d => d.delete_dt == null)
                     .Include(so => so.storing_order_tank.Where(d => d.delete_dt == null))
                     .Include(so => so.customer_company);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UseProjection]
        public IQueryable<storing_order> GetStoringOrdersById(string id, AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.storing_order.Where(c => c.guid.Equals(id))
                    .Where(d => d.delete_dt == null)
                    .Include(so => so.storing_order_tank)
                    .Include(so => so.customer_company);
            }
            catch(Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<customer_company> GetCompany(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.customer_company.Where(d => d.delete_dt == null);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<customer_company_contact_person> GetContactPerson(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.customer_company_contact_person.Where(d => d.delete_dt == null);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        //[UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<TankUnitType> GetTankUnitType(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
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
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<CodeValuesType> GetCodeValuesByType(CodeValuesType codeValuesType, AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
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
                    Description = c.Description,
                    ChildCode = c.ChildCode
                });

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<CodeValuesType> GetCodeValues(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
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
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<tariff_cleaning> GetLastCargo(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor,
            IResolverContext resolverContext)
        {
            try
            {
                return context.tariff_cleaning.Where(tc => tc.delete_dt == null);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
