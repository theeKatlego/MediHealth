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
        decimal consultationFee): ICommand<UserDto>;

    public sealed class CreateDoctorCommandHandler(IBookMdDbContext context) : ICommandHandler<CreateDoctorCommand, UserDto>
    {
        public async Task<Result<UserDto>> Handle(CreateDoctorCommand command, CancellationToken cancellationToken)
        {
            var doctor = new Doctor
            {
                ConsultationFee = command.consultationFee,
                Email = command.email,
                FirstName = command.firstName,
                LastName = command.lastName,
                Role = UserRole.Doctor,
                Specialization = command.Specialty,
                Id = Guid.NewGuid()
            };

            await context.Doctors.AddAsync(doctor);

            await context.SaveChangesAsync();

            return new UserDto
            {
                Email = doctor.Email,
                FirstName = doctor.FirstName,
                LastName = doctor.LastName,
                Id = doctor.Id
            };
        }
    }
}
