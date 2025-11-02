using BookMD.Data.Models;
using BookMD.Domain.Enums;

namespace BookMD.Domain.Models
{
    public class Doctor: User
    {
        public required MedicalSpecialty Specialization { get; init; }
        public decimal ConsultationFee { get; init; }
    }
}
