using IDMS.UserAuthentication.DB;
using Microsoft.EntityFrameworkCore;

namespace IDMS.User.Authentication.API.Utilities
{
    public class KeepAliveService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public KeepAliveService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            //while (!stoppingToken.IsCancellationRequested)
            //{
                using var scope = _serviceProvider.CreateScope();
                //var contextFactory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<ApplicationDbContext>>();
                var contextFactory = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                //var dbContext = await contextFactory.CreateDbContextAsync();

                try
                {
                    // Execute a lightweight query
                    //int res = await contextFactory.Database.ExecuteSqlRawAsync("SELECT Id FROM idms.aspnetusers Limit 1;", stoppingToken);
                    var res = await contextFactory.functions.Select(f => f.guid).FirstOrDefaultAsync();
                    //await dbContext.currency.Where(c => c.currency_code == "SGD").Select(c => c.guid).FirstOrDefaultAsync();
                }
                catch (Exception ex)
                {
                    // Handle exceptions if needed
                    Console.WriteLine($"KeepAlive query failed: {ex.Message}");
                }

                // Wait before the next execution
                //await Task.Delay(TimeSpan.FromMinutes(3), stoppingToken); // Adjust the interval as needed
            //}

        //     using (var scope = host.Services.CreateScope())
        //{
        //    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        //    // You can force EF to connect to the database, for example, by querying or ensuring the database is created
        //    dbContext.Database.EnsureCreated(); // This ensures the database is created if not already created
        //}
        }
    }
}
