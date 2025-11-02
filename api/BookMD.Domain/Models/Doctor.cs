using BookMD.Data.Models;

namespace BookMD.Domain.Models
{
    public class Doctor: User
    {
        public required string Specialization { get; init; }
        public decimal ConsultationFee { get; init; }
    }
}
