using BookMD.Data.Configurations;
using BookMD.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace BookMD.Data
{
    public class BookMdDbContext: DbContext
    {
        public DbSet<User> Users { get; set; }
        public BookMdDbContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(UserConfiguration).Assembly);
        }
    }
}
