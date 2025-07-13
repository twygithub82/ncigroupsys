using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Inventory.Application
{
    public class DbKeepAliveService : BackgroundService
    {
        private readonly IDbContextFactory<ApplicationInventoryDBContext> _factory;

        public DbKeepAliveService(IDbContextFactory<ApplicationInventoryDBContext> factory)
        {
            _factory = factory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var db = await _factory.CreateDbContextAsync(stoppingToken);
                    await db.Database.ExecuteSqlRawAsync("SELECT 1", cancellationToken: stoppingToken);
                    Console.WriteLine($"[KeepAlive] DB pinged at {DateTime.Now}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[KeepAlive Error] {ex.Message}");
                }


                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken); // ping every 5 min
            }
        }
    }
}
