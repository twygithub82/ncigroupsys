using Dot6.HotChoc12.CRUD.Demo.Data.Entities;
using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Dot6.HotChoc12.CRUD.Demo.Data.GqlTypes;


public class QueryType
{

    [Authorize]
    public async Task<List<Cake>> AllCakeAsync([Service] MyWorldDBContext context)
    {
        return await context.Cake.ToListAsync();

    }

     public async Task<Cake> TestCakeByIdAsync([Service] MyWorldDBContext context,int id)
    {
        // get the API setting
        //call the controller  and wait return
        // 
        return await context.Cake.FirstOrDefaultAsync(cake => cake.Id == id);


    }
}