using IDMS.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Billing.Application
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
                var contextFactory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<ApplicationBillingDBContext>>();
                var dbContext = await contextFactory.CreateDbContextAsync();

                try
                {
                    // Execute a lightweight query
                    //await dbContext.Database.ExecuteSqlRawAsync("SELECT 1", stoppingToken);
                    await dbContext.currency.Where(c => c.currency_code == "SGD").Select(c => c.guid).FirstOrDefaultAsync();
                }
                catch (Exception ex)
                {
                    // Handle exceptions if needed
                    Console.WriteLine($"KeepAlive query failed: {ex.Message}");
                }

                // Wait before the next execution
                //await Task.Delay(TimeSpan.FromMinutes(3), stoppingToken); // Adjust the interval as needed
            //}
        }
    }
}
