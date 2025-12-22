using IDMS.FileManagement.Interface;
using IDMS.FileManagement.Interface.DB;
using IDMS.FileManagement.Interface.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Utilities;
using QuestPDF.Fluent;
using System.Diagnostics;
using System.IO.Compression;

namespace IDMS.FileManagement.Service
{
    public class ReportService : IReport
    {
        private readonly ReportSettings _reportConfig;
        private readonly AppDBContext _context;
        private readonly IEmail _emailService;
        private readonly string _webRootPath;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<ReportService> _logger;

        public ReportService(ReportSettings reportSettings, AppDBContext appDBContext, IEmail emailService, IServiceScopeFactory scopeFactory, string env, ILogger<ReportService> logger)
        {
            _reportConfig = reportSettings;
            _context = appDBContext;
            _emailService = emailService;
            _webRootPath = env;
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        public async Task<bool> GenerateTankActivityReport()
        {
            try
            {
                var customers = await GetValidDailyCustomer();
                if (customers?.Any() ?? false)
                {
                    GenerateTankActivityReportThread(customers);
                    _logger.LogInformation("Tank Activity Report generation task started.");
                }

                await Task.Delay(200);
                return true;
            }
            catch (Exception ex) 
            {
                _logger.LogError(ex, "Error in GenerateTankActivityReport");
                throw;
            }
        }

        private async Task<bool> GenerateTankActivityReportThread(List<ValidCustomer> customers)
        {
            try
            {
                await using (var scope = _scopeFactory.CreateAsyncScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<AppDBContext>();
                    var customerGroupsResult = await GetTankActivityResult(customers, dbContext);

                    if (customerGroupsResult?.Any() ?? false)
                    {
                        foreach (var customerGroup in customerGroupsResult)
                        {
                            var customerData = customerGroup.Tanks
                                .SelectMany(t => t.Activities)
                                .ToList();

                            var report = new TankActivityReport(_reportConfig, _webRootPath, _logger);
                            report.LoadData(customerData, customerGroup);

                            var fileName = $"Tank Activity Report_{customerGroup.CustomerName}.pdf"
                                .Replace(" ", "_")
                                .Replace("/", "-");

                            if (_reportConfig.SaveFile)
                                report.GeneratePdf(_webRootPath + "/" + fileName);

                            var reportByteArray = report.GeneratePdf();
                            _logger.LogInformation($"Generated Tank Activity Report for customer: {customerGroup.Customer} with {customerData.Count} records.");

                            // Create ZIP archive in memory
                            using var zipStream = new MemoryStream();
                            using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create, true))
                            {
                                var zipEntry = archive.CreateEntry(fileName, CompressionLevel.Optimal);
                                using var entryStream = zipEntry.Open();
                                entryStream.Write(reportByteArray, 0, reportByteArray.Length);
                            }
                            zipStream.Position = 0; // Reset stream position

                            var toEmails = customers?.Where(c => c.code == customerGroup.Customer).Select(c => c.email).ToList();

                            if (toEmails?.Any() ?? false)
                            {
                                //For testing purpose
                                //toEmails[0] = "danielwongsh94@gmail.com";
                                var emailSubject = EirMessage.GetTankActivitySubject("");
                                var emailBody = EirMessage.GetTankActivityBody();

                                _emailService?.SendEmailWithZipAttachmentAsync(toEmails, null, null, emailSubject, emailBody, zipStream.ToArray(), fileName);
                                _logger.LogInformation($"Sent Tank Activity Report email to customer: {customerGroup.Customer} at {string.Join(", ", toEmails)}");
                            }
                        }
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                //Console.WriteLine($"[Error] {ex.Message}");
                //Console.WriteLine($"[StackTrace] {ex.StackTrace}");
                _logger.LogError(ex, "Error in GenerateTankActivityReportThread");
                throw;
            }
        }

        private async Task<List<ValidCustomer>?> GetValidDailyCustomer()
        {
            try
            {
                var validCustomers = await _context.customer_company
                                .Where(t => t.delete_dt == null)
                                .Select(t => new ValidCustomer
                                {
                                    code = t.code,
                                    email = t.email
                                })
                                .Distinct()
                                .ToListAsync();

                return validCustomers;
            }
            catch (Exception ex)
            {
                //Console.WriteLine($"[Error] {ex.Message}");
                //Console.WriteLine($"[StackTrace] {ex.StackTrace}");
                _logger.LogError(ex, "Error in GetValidDailyCustomer");
                throw;
            }
        }

        private async Task<List<CustomerGroup>?> GetTankActivityResult(List<ValidCustomer> validCustomers, AppDBContext _context)
        {
            // 2️⃣ Split into batches of 10
            const int batchSize = 10;
            var customerGroups = new List<CustomerGroup>();

            for (int i = 0; i < validCustomers.Count; i += batchSize)
            {
                // Get the next batch of up to 10 customers
                var batch = validCustomers
                    .Skip(i)
                    .Take(batchSize)
                    .ToList();

                // Extract only the customer codes for filtering
                var codes = batch.Select(b => b.code).ToList();

                // 3️⃣ Retrieve all results for this batch of customers
                var results = await _context.daily_tank_activity_result
                    .Where(t => codes.Contains(t.customer))
                    .ToListAsync();


                //Group the result here
                var batchGroups = results
                                    .GroupBy(r => new { r.customer, r.customer_name }) // group by both fields
                                    .Select(customerGroup => new CustomerGroup
                                    {
                                        Customer = customerGroup.Key.customer,
                                        CustomerName = customerGroup.Key.customer_name, // include readable name
                                        Tanks = customerGroup
                                            .GroupBy(r => r.tank_no)
                                            .Select(tankGroup => new TankGroup
                                            {
                                                TankNo = tankGroup.Key,
                                                Activities = tankGroup
                                                    .OrderBy(r => r.in_date)
                                                    .ToList()
                                            })
                                            .OrderBy(t => t.TankNo)
                                            .ToList()
                                    })
                                    .OrderBy(c => c.Customer)
                                    .ToList();

                // Accumulate into the main list
                customerGroups?.AddRange(batchGroups);

                // 4️⃣ Do something with this batch
                _logger.LogInformation($"Processing batch {i / batchSize + 1} ({batch.Count} customers)");
                // e.g., process, export, or aggregate data
            }

            //MessageBox.Show($"Loaded {results.Count} records from stored procedure.");
            _logger.LogInformation($"Total customers processed: {customerGroups?.Count}");
            return customerGroups;
        }
    }
}
