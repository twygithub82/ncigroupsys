using DWMS.Sample.GqlTypes;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddGraphQLServer()
                .AddQueryType<QueryType>();

var app = builder.Build();



//app.MapGet("/", () => "Hello World!");
app.MapGraphQL();


app.Run();
