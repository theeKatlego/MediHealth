using BookMD.Data;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

// Application Insights isn't enabled by default. See https://aka.ms/AAt8mw4.
// builder.Services
//     .AddApplicationInsightsTelemetryWorkerService()
//     .ConfigureFunctionsApplicationInsights();

builder.Services.AddDbContextFactory<BookMdDbContext>(optionsBuilder =>
  optionsBuilder
    .UseCosmos(
      connectionString: builder.Configuration.GetConnectionString("DefaultConnection")!,
      databaseName: "ApplicationDB",
      cosmosOptionsAction: options =>
      {
          options.ConnectionMode(Microsoft.Azure.Cosmos.ConnectionMode.Direct);
          options.MaxRequestsPerTcpConnection(16);
          options.MaxTcpConnectionsPerEndpoint(32);
      }));

builder.Build().Run();
