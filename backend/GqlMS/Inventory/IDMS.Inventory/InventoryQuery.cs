using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using IDMS.Models.Master;
using IDMS.Models.Shared;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Inventory.GqlTypes.LocalModel;

namespace IDMS.Inventory.GqlTypes
{
    public class InventoryQuery
    {
        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        //[UseProjection]
        //[UseFiltering]
        //[UseSorting]
        //public IQueryable<customer_company> QueryCustomerCompany([Service] IHttpContextAccessor httpContextAccessor,
        //    ApplicationInventoryDBContext context)
        //{
        //    try
        //    {
        //        return context.customer_company.Where(d => d.delete_dt == null || d.delete_dt == 0);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
        //    }
        //}

        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        //[UseProjection]
        //[UseFiltering]
        //[UseSorting]
        //public IQueryable<customer_company_contact_person> QueryContactPerson([Service] IHttpContextAccessor httpContextAccessor,
        //    ApplicationInventoryDBContext context)
        //{
        //    try
        //    {
        //        return context.customer_company_contact_person.Where(d => d.delete_dt == null || d.delete_dt == 0);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
        //    }
        //}

        //[UsePaging]

        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<tank> QueryTank([Service] IHttpContextAccessor httpContextAccessor, ApplicationInventoryDBContext context)
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
        public IQueryable<code_values> QueryCodeValuesByType(CodeValuesRequest codeValuesType, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context)
        {
            try
            { 
                var retCodeValues = context.code_values.Where(c => c.code_val_type.Equals(codeValuesType.code_val_type) &&
                                                              (c.delete_dt == null || c.delete_dt == 0));
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
        public IQueryable<code_values> QueryCodeValues([Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context)
        {
            try
            {
                var result = context.code_values.Where(c => c.delete_dt == null || c.delete_dt == 0);
                return result;

                //return context.code_values.Where(c => c.delete_dt == null || c.delete_dt == 0);
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

        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<surveyor> QuerySurveyor(ApplicationInventoryDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.surveyor.Where(t => t.delete_dt == null || t.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
