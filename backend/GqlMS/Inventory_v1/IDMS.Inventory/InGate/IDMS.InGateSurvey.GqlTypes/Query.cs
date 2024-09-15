using AutoMapper;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.InGateSurvey.GqlTypes
{
    public class Query
    {
        //public async Task<Record> AddTestSur(ApplicationInventoryDBContext context)
        //{
        //    int res = 3;
        //    List<string> list = new List<string>() {"assds2142ascsdfa", "dshdgajs234234jhsdkas", "3423ksdj9asaalf" };
        //    Record record = new Record()
        //    {
        //        affected = res,
        //        guid = list
        //    };
        //    return record;
        //}

        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        //[UseProjection]
        //[UseFiltering]
        //[UseSorting]
        //public IQueryable<surveyor> QuerySurveyor(ApplicationInventoryDBContext context,
        //   [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        //{
        //    IQueryable<surveyor> query = null;
        //    try
        //    {

        //        //var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        query = context.surveyor.Where(i => i.delete_dt == null || i.delete_dt == 0);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }

        //    return query;
        //}
    }

}
