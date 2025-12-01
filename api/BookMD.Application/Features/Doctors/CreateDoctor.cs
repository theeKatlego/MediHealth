using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using BookMD.Application.Common;
using BookMD.Domain.Dtos;
using BookMD.Domain.Enums;
using BookMD.Domain.Models;

namespace BookMD.Application.Features.Doctors
{
    public sealed record CreateDoctorCommand(
        string email,
        string firstName,
        string lastName,
        MedicalSpecialty Specialty,
        decimal consultationFee): ICommand<CreatedDoctorDto>;

    public sealed record CreatedDoctorDto(
        Guid id,
        string email,
        string firstName,
        string lastName,
        MedicalSpecialty Specialty,
        decimal consultationFee);

    public sealed class CreateDoctorCommandHandler(IBookMdDbContext context) : ICommandHandler<CreateDoctorCommand, CreatedDoctorDto>
    {
        public async Task<Result<CreatedDoctorDto>> Handle(CreateDoctorCommand command, CancellationToken cancellationToken)
        {
            var doctor = new Doctor
            {
                ConsultationFee = command.consultationFee,
                Email = command.email,
                FirstName = command.firstName,
                LastName = command.lastName,
                Role = UserRole.Doctor,
                Specialization = command.Specialty,
                Id = Guid.NewGuid(),
                PartitionKey = $"{UserRole.Doctor}-{command.Specialty}"
            };

            var result = await context.Doctors.AddAsync(doctor);

            await context.SaveChangesAsync();

            return new CreatedDoctorDto(
                result.Entity.Id,
                result.Entity.Email,
                result.Entity.FirstName,
                result.Entity.LastName,
                result.Entity.Specialization,
                result.Entity.ConsultationFee);
        }
    }
}
