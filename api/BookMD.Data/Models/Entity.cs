using Newtonsoft.Json;

namespace BookMD.Data.Models
{
    public abstract class Entity
    {
        [JsonProperty("id")]
        public required string Id { get; init; }
    }
}
