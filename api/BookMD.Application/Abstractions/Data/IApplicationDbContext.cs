using BookMD.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Application.Abstractions.Data;

public interface IBookMdDbContext
{
    DbSet<User> Users { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
