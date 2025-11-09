using Application.Abstractions.Messaging;
using BookMD.Application.Common;
using BookMD.Application.Features.Doctors;
using BookMD.Domain.Dtos;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace BookMD.BFF.Users;

public class Doctors
{
    private readonly ILogger<Doctors> _logger;
    private readonly ICommandHandler<CreateDoctorCommand, UserDto> _commandHandler;

    public Doctors(ILogger<Doctors> logger, ICommandHandler<CreateDoctorCommand, UserDto> commandHandler)
    {
        _logger = logger;
        _commandHandler = commandHandler;
    }

    [Function("Doctors")]
    public async Task<Result<UserDto>> CreateAsync([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req, [FromBody] CreateDoctorCommand command)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");

        var result = await _commandHandler.Handle(command, CancellationToken.None);

        return result;
    }
}