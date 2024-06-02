using Dot6.HotChoc12.CRUD.Demo.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Dot6.HotChoc12.CRUD.Demo.Data.GqlTypes;


public class QueryType
{
    public async Task<List<Cake>> AllCakeAsync([Service] MyWorldDBContext context)
    {
        return await context.Cake.ToListAsync();

    }

     public async Task<Cake> GetCakeById([Service] MyWorldDBContext context,int id)
    {
        return await context.Cake.FirstOrDefaultAsync(cake => cake.Id == id);


    }
}
