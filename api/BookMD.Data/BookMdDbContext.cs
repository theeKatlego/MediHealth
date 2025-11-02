using Application.Abstractions.Data;
using BookMD.Application.Abstractions.Messaging;
using BookMD.Data.Configurations;
using BookMD.Data.Models;
using BookMD.Domain.Events;
using BookMD.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace BookMD.Data
{
    public class BookMdDbContext(
        DbContextOptions<BookMdDbContext> options,
        IDomainEventsDispatcher domainEventsDispatcher) : DbContext(options), IBookMdDbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Doctor> Doctors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(UserConfiguration).Assembly);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            int result = await base.SaveChangesAsync(cancellationToken);

            await PublishDomainEventsAsync();

            return result;
        }

        private async Task PublishDomainEventsAsync()
        {
            var domainEvents = ChangeTracker
                .Entries<BaseModel>()
                .Select(entry => entry.Entity)
                .SelectMany(entity =>
                {
                    List<IDomainEvent> domainEvents = entity.DomainEvents;

                    entity.ClearDomainEvents();

                    return domainEvents;
                })
                .ToList();

            await domainEventsDispatcher.DispatchAsync(domainEvents);
        }
    }
}
