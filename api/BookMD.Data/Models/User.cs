namespace BookMD.Data.Models
{
    public class User: Entity
    {
        public const string DefaultPartitionKey = "users";
        public string PartitionKey => DefaultPartitionKey; // Put all items in the same partition

        public required string Email { get; init; }
        public required string FirstName { get; init; }
        public required string LastName { get; init; }
    }
}
