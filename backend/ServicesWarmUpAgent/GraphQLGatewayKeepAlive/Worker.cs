using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;



namespace ServicesKeepAlive
{
    public class KeepAliveWorker : BackgroundService
    {
        private readonly ILogger<KeepAliveWorker> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;
        private bool _disposed=false;
        public KeepAliveWorker(ILogger<KeepAliveWorker> logger, IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _logger = logger;
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var loginUrl = _config["KeepAliveSettings:LoginUrl"];
            var gqlUrl = _config["KeepAliveSettings:GraphQlUrl"];
            var frontendUrl = _config["KeepAliveSettings:FrontendUrl"];
            var username = _config["KeepAliveSettings:Username"];
            var password = _config["KeepAliveSettings:Password"];
            var intervalMinutes = double.Parse(_config["KeepAliveSettings:IntervalMinutes"] ?? "5");
            

            var httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(30) // Add timeout to prevent hanging
            };

            _logger.LogInformation("KeepAlive service started.");
            int maxSecs= Convert.ToInt16( intervalMinutes * 60);
            int counter = 0;
            while (!_disposed)
            {
                try
                {
                    if (counter <= 0)
                    {
                        counter = maxSecs;
                        _logger.LogInformation("Starting keep-alive cycle...");

                        var token = await LoginAsync(loginUrl!, username!, password!, httpClient, stoppingToken);
                        if (string.IsNullOrEmpty(token))
                        {
                            _logger.LogWarning("Login failed, skipping this cycle...");
                        }
                        else
                        {
                            _logger.LogInformation("Login successful, proceeding with GraphQL and frontend calls.");

                            await QueryGraphQLAsync(gqlUrl!, token, httpClient, stoppingToken);
                            //await CallFrontendAsync(frontendUrl!, token, httpClient, stoppingToken);
                            await LoadFrontendAsync(frontendUrl!);

                            _logger.LogInformation($"Keep-alive successful at {DateTime.Now}");
                        }
                    }
                }
                catch (TaskCanceledException)
                {
                    _logger.LogWarning("KeepAlive cycle cancelled.");
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during keep-alive cycle");
                }

                try
                {
                    int interval = 30;
                    _logger.LogInformation($"Waiting... {counter} seconds remaining until next cycle - {DateTime.Now} ");
                    System.Threading.Thread.Sleep((interval*1000));
                    counter -= interval;
                  
                    //await Task.Delay(TimeSpan.FromMinutes(intervalMinutes), stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    _logger.LogWarning("Delay cancelled, exiting keep-alive loop.");
                    break;
                }
            }

            _logger.LogWarning("KeepAlive : Exited");
        }



        private async Task<string?> LoginAsync(string loginUrl, string username, string password, HttpClient client, CancellationToken CancelToken)
        {
            //var client = _httpClientFactory.CreateClient();
            var body = new { username, password };
            var json = JsonSerializer.Serialize(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync(loginUrl, content, CancelToken);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Login failed with status code {StatusCode}", response.StatusCode);
                return null;
            }

            var responseBody = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseBody);
            if (doc.RootElement.TryGetProperty("token", out var tokenElement))
            {
                return tokenElement.GetString();
            }

            _logger.LogWarning("Token not found in login response");
            return null;
        }

        private async Task QueryGraphQLAsync(string gqlUrl, string token, HttpClient client, CancellationToken CancelToken)
        {
            //var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var query = @"
            query queryTariffDepot($first: Int) {
                tariffDepotResult: queryTariffDepot(first: $first) {
                    nodes {
                        guid
                        description
                    }
                }
            }";

            var payload = new
            {
                query,
                variables = new { first = 1 }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync(gqlUrl, content, CancelToken);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("GraphQL query failed with status code {StatusCode}", response.StatusCode);
                return;
            }

            _logger.LogInformation("GraphQL query executed successfully");
        }

        private async Task CallFrontendAsync(string frontendUrl, string token, HttpClient client, CancellationToken CancelToken)
        {
            //var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);


            var response = await client.GetAsync(frontendUrl, CancelToken);
            response.EnsureSuccessStatusCode();

            if (response.IsSuccessStatusCode)
            {
                var cnt=response.Content;
                var contentText=await cnt.ReadAsStringAsync();
                _logger.LogInformation("Frontend ping successful");
            }
            else
            {
                _logger.LogWarning("Frontend ping failed with status code {StatusCode}", response.StatusCode);
            }
        }

        private async Task LoadFrontendAsync(string url)
        {
            var browserService = new BrowserMimicService();
            try
            {
                _logger.LogInformation("Frontend fully loading at: " + DateTime.Now);
                var result = await browserService.LoadPageWithResourcesAsync(url);

                if (result.Success)
                {
                    Console.WriteLine($"✓ Main page loaded successfully");
                    Console.WriteLine($"✓ Found {result.Resources.Count} resources");
                    Console.WriteLine($"✓ Made {result.ApiCalls.Count} API calls");

                    // Save complete results
                    _logger.LogInformation("Frontend fully loaded at: " + DateTime.Now);
                }
                else
                {
                    _logger.LogInformation($"Frontend ✗ Error : {result.ErrorMessage}  at {DateTime.Now}");
                    
                }

               
            }
            catch (Exception ex)
            {
                _logger.LogInformation("Error loading frontend: " + ex.Message);
            }
            finally
            {
                browserService = null;
            }
        }


    }
}
