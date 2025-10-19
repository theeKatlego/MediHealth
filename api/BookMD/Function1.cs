using Application.Abstractions.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BookMD
{
    public class Function1
    {
        private readonly IBookMdDbContext _context;
        private readonly ILogger<Function1> _logger;

        public Function1(IBookMdDbContext context, ILogger<Function1> logger)
        {
            _context = context;
            _logger = logger;
        }

        [Function("Function1")]
        public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            var userCount = await _context.Users.CountAsync();
            
            _logger.LogInformation("User count: {0}", userCount);

            return new OkObjectResult("Welcome to Azure Functions!");
        }
    }
}
