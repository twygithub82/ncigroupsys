using HotChocolate;
using IDMS.StoringOrder.GqlTypes.Repo;
using HotChocolate.Types;
using IDMS.StoringOrder.Model.Domain;
using Microsoft.AspNetCore.Http;
using IDMS.StoringOrder.Model.Type;
using AutoMapper;
using HotChocolate.Resolvers;
using IDMS.StoringOrder.Model.Domain.Customer;


namespace IDMS.StoringOrder.GqlTypes
{
    public class Query
    {


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<customer_company> QueryCustomerCompany(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
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
        public IQueryable<customer_company_contact_person> QueryContactPerson(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
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
        public IQueryable<TankRequest> QueryTank(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.tank_unit_type.Select(c => new TankRequest()
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
        public IQueryable<CodeValuesRequest> QueryCodeValuesByType(CodeValuesRequest codeValuesType, AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var retCodeValues = context.code_values.Where(c => c.code_val_type.Equals(codeValuesType.CodeValType));
                if (retCodeValues.Count() <= 0)
                {
                    throw new GraphQLException(new Error("Code values type not found.", "NOT_FOUND"));
                }

                return retCodeValues.Select(c => new CodeValuesRequest()
                {
                    Guid = c.guid,
                    CodeValue = c.code_val,
                    CodeValType = c.code_val_type,
                    Description = c.description,
                    ChildCode = c.child_code,
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
        public IQueryable<CodeValuesRequest> QueryCodeValues(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.code_values.Select(c => new CodeValuesRequest()
                {
                    Guid = c.guid,
                    CodeValue = c.code_val,
                    CodeValType = c.code_val_type,
                    Description = c.description,
                    ChildCode = c.child_code,
                });
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        //[UseProjection]
        //[UseFiltering]
        //[UseSorting]
        //public IQueryable<tariff_cleaning> QueryTariffCleaning(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor,
        //    IResolverContext resolverContext)
        //{
        //    try
        //    {
        //        return context.tariff_cleaning.Where(tc => tc.delete_dt == null);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
        //    }
        //}
    }
}
