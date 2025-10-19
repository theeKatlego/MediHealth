using Application.Abstractions.Messaging;
using BookMD.Application.Features.Users;
using BookMD.BFF.Extensions;
using BookMD.BFF.Infrastructure;
using BookMD.Domain.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace BookMD.BFF.Users;

public class ListUsers
{
    private readonly IQueryHandler<ListUsersQuery, IEnumerable<UserDto>> _queryHandler;
    private readonly ILogger<ListUsers> _logger;

    public ListUsers(ILogger<ListUsers> logger,
        IQueryHandler<ListUsersQuery, IEnumerable<UserDto>> queryHandler)
    {
        _logger = logger;
        _queryHandler = queryHandler;
    }

    [Function("ListUsers")]
    public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");

        var result = await _queryHandler.Handle(new ListUsersQuery(), CancellationToken.None);

        return new OkObjectResult(result.Match(Results.Ok, CustomResults.Problem));
    }
}