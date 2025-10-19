using BookMD.Domain.Events;

namespace BookMD.Application.Abstractions.Messaging;

public interface IDomainEventsDispatcher
{
    Task DispatchAsync(IEnumerable<IDomainEvent> domainEvents, CancellationToken cancellationToken = default);
}
