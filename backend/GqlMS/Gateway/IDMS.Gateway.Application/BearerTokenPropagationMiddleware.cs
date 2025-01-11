using HotChocolate.Resolvers;

namespace IDMS.Gateway.Application
{
    public class BearerTokenPropagationMiddleware
    {
        private readonly FieldDelegate _next;

        public BearerTokenPropagationMiddleware(FieldDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(IMiddlewareContext context)
        {
            var httpContext = context.ContextData["HttpContext"] as HttpContext;
            if (httpContext?.Items["BearerToken"] is string bearerToken)
            {
                // Pass the Bearer token to the downstream request headers
                context.ContextData["BearerToken"] = bearerToken;
            }

            await _next(context);
        }
    }
}
