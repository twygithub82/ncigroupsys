using Dot6.HotChoc12.CRUD.Demo.Data;
using Dot6.HotChoc12.CRUD.Demo.Data.Entities;
using HotChocolate.Subscriptions;

namespace Dot6.HotChoc12.CRUD.Demo.GqlTypes;

public class MutationType
{
    public async Task<Cake> SaveCakeAsync([Service] MyWorldDBContext context, Cake newCake,[Service] ITopicEventSender topicEventSender)
    {
        try
        {
            context.Cake.Add(newCake);
            await context.SaveChangesAsync();
            await topicEventSender.SendAsync(nameof(SubscriptionType.CakeCreated), newCake);

            return newCake;
        }
        catch(Exception ex)
        {
            throw ex;
        }
    }

    public async Task<Cake>UpdateCakeAsync([Service] MyWorldDBContext context, Cake updateCake)
    {
        context.Cake.Update(updateCake);
        await context.SaveChangesAsync();
        return updateCake;
    }


    public async Task<string>DeleteCakeAsync([Service] MyWorldDBContext context, int id)
    {
       var cakeTodelete = await context.Cake.FindAsync(id);
       if(cakeTodelete==null)
       {
         return "invalid operation";
       }

       context.Cake.Remove(cakeTodelete);
       await context.SaveChangesAsync();
       return "Deleted!";
    }
}