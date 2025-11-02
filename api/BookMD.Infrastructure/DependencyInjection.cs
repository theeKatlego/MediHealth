using Application.Abstractions.Data;
using BookMD.Application.Common;
using BookMD.Data;
using HealthChecks.CosmosDb;
using Infrastructure.Time;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BookMD.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration) =>
            services
                .AddServices()
                .AddDatabase(configuration)
                .AddHealthChecks(configuration);

        private static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddSingleton<IDateTimeProvider, DateTimeProvider>();

            return services;
        }

        private static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
        {
            string connectionString = configuration["BookMdConnectionString"]!;

            services.AddDbContextFactory<BookMdDbContext>(optionsBuilder =>
              optionsBuilder
                .UseCosmos(
                  connectionString: connectionString,
                  databaseName: "bookmd"));

            services.AddScoped<IBookMdDbContext>(sp => sp.GetRequiredService<BookMdDbContext>());

            return services;
        }

        private static IServiceCollection AddHealthChecks(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddHealthChecks()
                .AddAzureCosmosDB(
                    optionsFactory: sp => new AzureCosmosDbHealthCheckOptions()
                    {
                        DatabaseId = "bookmd"
                    }
                );

            return services;
        }
    }
}
