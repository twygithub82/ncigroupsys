using HotChocolate;
using IDMS.StoringOrder.GqlTypes.Repo;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using AutoMapper;
using HotChocolate.Resolvers;
using IDMS.Models.Master;
using IDMS.Models.Shared;
using IDMS.StoringOrder.Model.Request;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using IDMS.Models.Tariff;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

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
        public IQueryable<tank> QueryTank(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.tank.Where(t => t.delete_dt == null || t.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<code_values> QueryCodeValuesByType(CodeValuesRequest codeValuesType, AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var retCodeValues = context.code_values.Where(c => c.code_val_type.Equals(codeValuesType.code_val_type) &
                                                              (c.delete_dt == null || c.delete_dt == 0 ));
                if (retCodeValues.Count() <= 0)
                {
                    throw new GraphQLException(new Error("Code values type not found.", "NOT_FOUND"));
                }

                return retCodeValues;
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
        public IQueryable<code_values> QueryCodeValues(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.code_values.Where(c=>c.delete_dt == null | c.delete_dt == 0);
                //return context.code_values.Select(c => new CodeValuesRequest()
                //{
                //    Guid = c.guid,
                //    CodeValue = c.code_val,
                //    CodeValType = c.code_val_type,
                //    Description = c.description,
                //    ChildCode = c.child_code,
                //});
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
