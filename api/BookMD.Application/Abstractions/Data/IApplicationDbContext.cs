using BookMD.Data.Models;
using BookMD.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Application.Abstractions.Data;

public interface IBookMdDbContext
{
    DbSet<User> Users { get; }
    DbSet<Doctor> Doctors { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
