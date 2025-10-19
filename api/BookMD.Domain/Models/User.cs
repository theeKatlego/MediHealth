namespace BookMD.Data.Models
{
    public class User: BaseModel
    {
        public required string Email { get; init; }
        public required string FirstName { get; init; }
        public required string LastName { get; init; }
    }
}
