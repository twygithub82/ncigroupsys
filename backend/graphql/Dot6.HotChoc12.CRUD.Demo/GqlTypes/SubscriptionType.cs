using Dot6.HotChoc12.CRUD.Demo.Data.Entities;

namespace Dot6.HotChoc12.CRUD.Demo.GqlTypes;


public class SubscriptionType
{
    [Subscribe]
    public Cake CakeCreated([EventMessage]Cake cake)=>cake;
}
