using BookMD.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookMD.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);
            //builder.HasPartitionKey(a => a.PartitionKey);
            builder.ToContainer("users");
            builder.HasNoDiscriminator();
        }
    }
}
