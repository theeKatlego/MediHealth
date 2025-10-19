using BookMD.Domain.Events;

namespace BookMD.Data.Models
{
    public abstract class BaseModel
    {
        public required Guid Id { get; init; }


        private readonly List<IDomainEvent> _domainEvents = [];

        public List<IDomainEvent> DomainEvents => [.. _domainEvents];

        public void ClearDomainEvents()
        {
            _domainEvents.Clear();
        }

        public void Raise(IDomainEvent domainEvent)
        {
            _domainEvents.Add(domainEvent);
        }
    }
}
