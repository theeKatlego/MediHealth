using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using BookMD.Application.Common;
using BookMD.Domain.Dtos;
using BookMD.Domain.Enums;
using BookMD.Domain.Models;

namespace BookMD.Application.Features.Doctors
{
    public sealed record CreateDoctorCommand(): ICommand<Result<UserDto>>;

    public sealed class CreateDoctor(IBookMdDbContext context) : ICommandHandler<CreateDoctorCommand, Result<UserDto>>
    {
        public async Task<Result<Result<UserDto>>> Handle(CreateDoctorCommand command, CancellationToken cancellationToken)
        {
            await context.Doctors.AddAsync(new Doctor {
                ConsultationFee = 1,
                Email = "test@mail.com",
                FirstName = "John",
                LastName = "Smith",
                Role = UserRole.Doctor,
                Specialization = MedicalSpecialty.Dentistry,
                Id = Guid.NewGuid()
            });

            await context.SaveChangesAsync();

            throw new NotImplementedException();
        }
    }
}
