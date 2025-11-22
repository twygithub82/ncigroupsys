using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace ServiceWarmUpAgent.Data
{
    public class PageLoadResult
    {
        public string Url { get; set; }
        public bool Success { get; set; }
        public string ErrorMessage { get; set; }
        public ResourceContent MainContent { get; set; }
        public List<ResourceContent> Resources { get; set; }
        public List<ApiCallResult> ApiCalls { get; set; }
    }

    public class ResourceContent
    {
        public string Url { get; set; }
        public string Content { get; set; }
        public bool Success { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public string ContentType { get; set; }
        public long ContentLength { get; set; }
        public string ErrorMessage { get; set; }
    }

    public class ApiCallResult
    {
        public string Url { get; set; }
        public string Content { get; set; }
        public bool Success { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public string ContentType { get; set; }
        public string ErrorMessage { get; set; }
    }

    public class ResourceUrls
    {
        public List<string> CssFiles { get; set; } = new List<string>();
        public List<string> JavaScriptFiles { get; set; } = new List<string>();
        public List<string> Images { get; set; } = new List<string>();
        public List<string> ApiEndpoints { get; set; } = new List<string>();
    }
}
