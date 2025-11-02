using BookMD.Data.Models;
using BookMD.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookMD.Data.Configurations
{
    public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
    {
        public void Configure(EntityTypeBuilder<Doctor> builder)
        {
            builder.HasKey(doctor => doctor.Id);
            builder.HasPartitionKey(doctor => doctor.Specialization);
            builder.ToContainer("doctors");
            builder.HasNoDiscriminator();
        }
    }
}
