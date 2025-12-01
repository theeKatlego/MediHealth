using Application.Abstractions.Messaging;
using BookMD.Application.Features.Doctors;
using BookMD.BFF.Extensions;
using BookMD.BFF.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using FromBodyAttribute = Microsoft.Azure.Functions.Worker.Http.FromBodyAttribute;

namespace BookMD.BFF.Users;

public class Doctors
{
    private readonly ILogger<Doctors> _logger;
    private readonly ICommandHandler<CreateDoctorCommand, CreatedDoctorDto> _commandHandler;

    public Doctors(ILogger<Doctors> logger, ICommandHandler<CreateDoctorCommand, CreatedDoctorDto> commandHandler)
    {
        _logger = logger;
        _commandHandler = commandHandler;
    }

    [Function("Doctors")]
    public async Task<IActionResult> CreateAsync([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req, [FromBody] CreateDoctorCommand command)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");

        var result = await _commandHandler.Handle(command, CancellationToken.None);

        return new OkObjectResult(result.Match(Results.Ok, CustomResults.Problem));
    }
}