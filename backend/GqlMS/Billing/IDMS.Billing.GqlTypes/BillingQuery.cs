using HotChocolate.Types;
using HotChocolate;
using Microsoft.Extensions.Configuration;
using IDMS.Models.DB;
using Microsoft.AspNetCore.Http;
using IDMS.Models.Billing;
using IDMS.Billing.Application;
using IDMS.Billing.GqlTypes.LocalModel;
using Microsoft.EntityFrameworkCore;
using CommonUtil.Core.Service;
using IDMS.Models.Tariff;
using IDMS.Models.Parameter;
using IDMS.Billing.GqlTypes.BillingResult;
using IDMS.Models.Shared;


namespace IDMS.Billing.GqlTypes
{
    public class BillingQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<billing> QueryBilling([Service] IHttpContextAccessor httpContextAccessor,
                [Service] IConfiguration config, ApplicationBillingDBContext context)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                return context.billing.Where(d => d.delete_dt == null || d.delete_dt == 0);
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
        public IQueryable<billing_sot> QueryBillingSOT([Service] IHttpContextAccessor httpContextAccessor,
               [Service] IConfiguration config, ApplicationBillingDBContext context)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                return context.billing_sot.Where(d => d.delete_dt == null || d.delete_dt == 0);
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
        public IQueryable<storage_detail> QueryStorageDetail([Service] IHttpContextAccessor httpContextAccessor,
                [Service] IConfiguration config, ApplicationBillingDBContext context)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                return context.storage_detail.Where(d => d.delete_dt == null || d.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        private long StartDateExtract(long dateTimeEpoch)
        {

            DateTime dateTime = DateTimeOffset.FromUnixTimeSeconds(dateTimeEpoch).UtcDateTime;

            // Set time to 00:00:00 (midnight)
            DateTime dateOnly = dateTime.Date;  // This removes the time portion

            //DateTime dateGMT = dateOnly.ToUniversalTime();

            // Convert the DateTime back to epoch time (in seconds)
            long epochDateOnly = ((DateTimeOffset)dateOnly).ToUnixTimeSeconds();

            return epochDateOnly;
        }

        private long EndDateExtract(long endTimeEpoch)
        {
            // Assume you have an epoch timestamp in seconds
            //long epochTimestamp = 1615825923; // Example epoch timestamp

            // Convert epoch to DateTime
            DateTime dateTime = DateTimeOffset.FromUnixTimeSeconds(endTimeEpoch).UtcDateTime;

            // Set time to the end of the day (23:59:59)
            DateTime endOfDay = dateTime.Date.AddDays(1).AddTicks(-1); // 23:59:59.9999999

            // Convert the DateTime back to epoch time (in seconds)
            long epochEndOfDay = ((DateTimeOffset)endOfDay).ToUnixTimeSeconds();

            return epochEndOfDay;
        }
    }
}
