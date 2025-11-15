using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Net;
using ServicesKeepAlive.Data;

namespace ServicesKeepAlive
{
    public class BrowserMimicService
    {
        private readonly HttpClient _httpClient;
        private CookieContainer _cookieContainer;

        public BrowserMimicService()
        {
            _cookieContainer = new CookieContainer();

            var handler = new HttpClientHandler
            {
                CookieContainer = _cookieContainer,
                UseCookies = true,
                AllowAutoRedirect = true,
                AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate,
                UseProxy = false,
                ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
            };

            _httpClient = new HttpClient(handler);
            _httpClient.Timeout = TimeSpan.FromSeconds(60);

            SetBrowserHeaders();
        }

        private void SetBrowserHeaders()
        {
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");
            _httpClient.DefaultRequestHeaders.Add("Accept",
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
            _httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-US,en;q=0.9");
            _httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            _httpClient.DefaultRequestHeaders.Add("Cache-Control", "no-cache");
            _httpClient.DefaultRequestHeaders.Add("sec-ch-ua", "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"");
            _httpClient.DefaultRequestHeaders.Add("sec-ch-ua-mobile", "?0");
            _httpClient.DefaultRequestHeaders.Add("sec-ch-ua-platform", "\"Windows\"");
            _httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Dest", "document");
            _httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Mode", "navigate");
            _httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Site", "none");
            _httpClient.DefaultRequestHeaders.Add("Upgrade-Insecure-Requests", "1");
        }

        public async Task<PageLoadResult> LoadPageWithResourcesAsync(string url)
        {
            var result = new PageLoadResult { Url = url };

            try
            {
                // Step 1: Load main page
                result.MainContent = await LoadPageAsync(url);
                if (!result.MainContent.Success) return result;

                // Step 2: Extract and load all resources
                var resources = ExtractResources(result.MainContent.Content, url);
                result.Resources = new List<ResourceContent>();

                // Load CSS files
                foreach (var cssUrl in resources.CssFiles)
                {
                    var cssContent = await LoadResourceAsync(cssUrl);
                    result.Resources.Add(cssContent);
                }

                // Load JavaScript files
                foreach (var jsUrl in resources.JavaScriptFiles)
                {
                    var jsContent = await LoadResourceAsync(jsUrl);
                    result.Resources.Add(jsContent);
                }

                // Load images
                foreach (var imgUrl in resources.Images.Take(10)) // Limit images to avoid too many requests
                {
                    var imgContent = await LoadResourceAsync(imgUrl);
                    result.Resources.Add(imgContent);
                }

                // Step 3: Extract and call API endpoints (if detectable)
                var apiEndpoints = ExtractApiEndpoints(result.MainContent.Content, resources.JavaScriptFiles);
                result.ApiCalls = new List<ApiCallResult>();

                foreach (var apiUrl in apiEndpoints.Take(5)) // Limit API calls
                {
                    var apiResult = await CallApiEndpointAsync(apiUrl);
                    result.ApiCalls.Add(apiResult);
                }

                result.Success = true;
            }
            catch (Exception ex)
            {
                result.ErrorMessage = ex.Message;
                result.Success = false;
            }

            return result;
        }

        private async Task<ResourceContent> LoadPageAsync(string url)
        {
            try
            {
                var response = await _httpClient.GetAsync(url);
                var content = await response.Content.ReadAsStringAsync();

                return new ResourceContent
                {
                    Url = url,
                    Content = content,
                    Success = response.IsSuccessStatusCode,
                    StatusCode = response.StatusCode,
                    ContentType = response.Content.Headers.ContentType?.MediaType
                };
            }
            catch (Exception ex)
            {
                return new ResourceContent
                {
                    Url = url,
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        private async Task<ResourceContent> LoadResourceAsync(string url)
        {
            try
            {
                var response = await _httpClient.GetAsync(url);
                byte[] contentBytes = await response.Content.ReadAsByteArrayAsync();

                return new ResourceContent
                {
                    Url = url,
                    Content = response.Content.Headers.ContentType?.MediaType?.StartsWith("text/") == true
                        ? await response.Content.ReadAsStringAsync()
                        : $"[Binary content - {contentBytes.Length} bytes]",
                    Success = response.IsSuccessStatusCode,
                    StatusCode = response.StatusCode,
                    ContentType = response.Content.Headers.ContentType?.MediaType,
                    ContentLength = contentBytes.Length
                };
            }
            catch (Exception ex)
            {
                return new ResourceContent
                {
                    Url = url,
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        private async Task<ApiCallResult> CallApiEndpointAsync(string apiUrl)
        {
            try
            {
                // Add API-specific headers
                var request = new HttpRequestMessage(HttpMethod.Get, apiUrl);
                request.Headers.Add("Accept", "application/json, text/plain, */*");
                request.Headers.Add("X-Requested-With", "XMLHttpRequest");

                var response = await _httpClient.SendAsync(request);
                var content = await response.Content.ReadAsStringAsync();

                return new ApiCallResult
                {
                    Url = apiUrl,
                    Content = content,
                    Success = response.IsSuccessStatusCode,
                    StatusCode = response.StatusCode,
                    ContentType = response.Content.Headers.ContentType?.MediaType
                };
            }
            catch (Exception ex)
            {
                return new ApiCallResult
                {
                    Url = apiUrl,
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        private ResourceUrls ExtractResources(string htmlContent, string baseUrl)
        {
            var resources = new ResourceUrls();

            // Extract CSS files
            var cssMatches = Regex.Matches(htmlContent,
                @"<link[^>]*href=[""']([^""']+\.css[^""']*)[""'][^>]*>",
                RegexOptions.IgnoreCase);

            foreach (Match match in cssMatches)
            {
                if (match.Groups[1].Success)
                {
                    resources.CssFiles.Add(ToAbsoluteUrl(match.Groups[1].Value, baseUrl));
                }
            }

            // Extract JavaScript files
            var jsMatches = Regex.Matches(htmlContent,
                @"<script[^>]*src=[""']([^""']+\.js[^""']*)[""'][^>]*>",
                RegexOptions.IgnoreCase);

            foreach (Match match in jsMatches)
            {
                if (match.Groups[1].Success)
                {
                    resources.JavaScriptFiles.Add(ToAbsoluteUrl(match.Groups[1].Value, baseUrl));
                }
            }

            // Extract images
            var imgMatches = Regex.Matches(htmlContent,
                @"<img[^>]*src=[""']([^""']+)[""'][^>]*>",
                RegexOptions.IgnoreCase);

            foreach (Match match in imgMatches)
            {
                if (match.Groups[1].Success)
                {
                    resources.Images.Add(ToAbsoluteUrl(match.Groups[1].Value, baseUrl));
                }
            }

            return resources;
        }

        private List<string> ExtractApiEndpoints(string htmlContent, List<string> jsFiles)
        {
            var endpoints = new List<string>();

            // Extract from HTML data attributes
            var dataAttrMatches = Regex.Matches(htmlContent,
                @"data-(?:url|api|endpoint)=[""']([^""']+)[""']",
                RegexOptions.IgnoreCase);

            foreach (Match match in dataAttrMatches)
            {
                if (match.Groups[1].Success)
                {
                    endpoints.Add(match.Groups[1].Value);
                }
            }

            // Common API patterns in Angular/React apps
            var apiPatterns = new[]
            {
        @"/api/",
        @"api\.",
        @"/graphql",
        @"/rest/",
        @"/v1/",
        @"/v2/"
    };

            foreach (var pattern in apiPatterns)
            {
                var patternMatches = Regex.Matches(htmlContent,
                    $@"[""']({pattern}[^""']+)[""']",
                    RegexOptions.IgnoreCase);

                foreach (Match match in patternMatches)
                {
                    if (match.Groups[1].Success)
                    {
                        endpoints.Add(match.Groups[1].Value);
                    }
                }
            }

            return endpoints.Distinct().ToList();
        }

        private string ToAbsoluteUrl(string relativeUrl, string baseUrl)
        {
            if (string.IsNullOrEmpty(relativeUrl)) return relativeUrl;

            if (relativeUrl.StartsWith("http://") || relativeUrl.StartsWith("https://") ||
                relativeUrl.StartsWith("//"))
                return relativeUrl;

            if (relativeUrl.StartsWith("/"))
            {
                var uri = new Uri(baseUrl);
                return $"{uri.Scheme}://{uri.Host}{relativeUrl}";
            }

            // For relative URLs
            var baseUri = new Uri(baseUrl);
            return new Uri(baseUri, relativeUrl).ToString();
        }
    }

}