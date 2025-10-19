using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using BookMD.Application.Common;
using BookMD.Domain.Dtos;
using Microsoft.EntityFrameworkCore;

namespace BookMD.Application.Features.Users
{
    public sealed record ListUsersQuery() : IQuery<IEnumerable<UserDto>>;

    internal sealed class ListUsersQueryHandler(IBookMdDbContext context) : IQueryHandler<ListUsersQuery, IEnumerable<UserDto>>
    {
        public async Task<Result<IEnumerable<UserDto>>> Handle(ListUsersQuery query, CancellationToken cancellationToken)
        {
            var users = await context
                .Users
                .Select(user => new UserDto { 
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName
                })
                .ToListAsync(cancellationToken);

            return users;
        }
    }
}
