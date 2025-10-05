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

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var token = await LoginAsync(loginUrl!, username!, password!);
                    if (string.IsNullOrEmpty(token))
                    {
                        _logger.LogWarning("Login failed, skipping this cycle...");
                    }
                    else
                    {
                        await QueryGraphQLAsync(gqlUrl!, token);
                        await CallFrontendAsync(frontendUrl!,token);
                        _logger.LogInformation($"Keep-alive successful at {DateTime.Now}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during keep-alive cycle");
                }

                await Task.Delay(TimeSpan.FromMinutes(intervalMinutes), stoppingToken);
            }
        }

        private async Task<string?> LoginAsync(string loginUrl, string username, string password)
        {
            var client = _httpClientFactory.CreateClient();
            var body = new { username, password };
            var json = JsonSerializer.Serialize(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync(loginUrl, content);
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

        private async Task QueryGraphQLAsync(string gqlUrl, string token)
        {
            var client = _httpClientFactory.CreateClient();
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

            var response = await client.PostAsync(gqlUrl, content);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("GraphQL query failed with status code {StatusCode}", response.StatusCode);
                return;
            }

            _logger.LogInformation("GraphQL query executed successfully");
        }

        private async Task CallFrontendAsync(string frontendUrl, string token)
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await client.GetAsync(frontendUrl);
            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Frontend ping successful");
            }
            else
            {
                _logger.LogWarning("Frontend ping failed with status code {StatusCode}", response.StatusCode);
            }
        }
    }
}
