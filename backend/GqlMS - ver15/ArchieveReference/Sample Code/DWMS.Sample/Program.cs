using DWMS.Sample.GqlTypes;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddGraphQLServer()
                .AddInMemorySubscriptions()
                .AddQueryType<QueryType>()
                .AddMutationType<MutationType>()
                .AddSubscriptionType<ClasSubscriptionTypes1>();

var app = builder.Build();




//app.MapGet("/", () => "Hello World!");
app.MapGraphQL();

app.UseWebSockets();

app.Run();
