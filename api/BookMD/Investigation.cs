using Application.Abstractions.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace BookMD
{
    public class Investigation
    {
        private readonly IBookMdDbContext _context;
        private readonly ILogger<Investigation> _logger;
        private readonly IConfiguration _configuration;

        public Investigation(IBookMdDbContext context, ILogger<Investigation> logger, IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _configuration = configuration;
        }

        [Function("Function1")]
        public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            var userCount = await _context.Users.CountAsync();

            _logger.LogInformation("User count: {0}", userCount);

            return new OkObjectResult("Welcome to Azure Functions!");
        }

        [Function("test")]
        public async Task<IActionResult> TestAsync([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            return new OkObjectResult("Welcome to Azure Functions!");
        }

        [Function("Configurations")]
        public IActionResult listConfigurations([HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            return new OkObjectResult(JsonConvert.SerializeObject(_configuration.AsEnumerable()));
        }

        [Function("EnvironmentVariables")]
        public IActionResult ListEnvironmentVariables([HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");

            return new OkObjectResult(JsonConvert.SerializeObject(Environment.GetEnvironmentVariables()));
        }

        [Function("EnvironmentVariable")]
        public IActionResult GetEnvironmentVariable([HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");
            var key = req.Form["key"];
            var variables = Environment.GetEnvironmentVariables();
            if (variables.Contains(key))
                return new OkObjectResult(JsonConvert.SerializeObject(variables[key]));

            return new NotFoundObjectResult(key);
        }
    }
}
