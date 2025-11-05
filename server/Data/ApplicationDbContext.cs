using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<Internship> Internships { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }

    public override int SaveChanges()
    {
        AddTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        AddTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void AddTimestamps()
    {
        var entities = ChangeTracker.Entries()
            .Where(x => x is { Entity: EntityBase, State: EntityState.Added or EntityState.Modified });
        foreach (var entity in entities)
        {
            var now = DateTime.UtcNow;

            if (entity.State == EntityState.Added)
            {
                ((EntityBase)entity.Entity).CreatedAt = now;
            }
            ((EntityBase)entity.Entity).UpdatedAt = now;
        }
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSeeding((context, _) =>
        {
            var adminNum = context.Set<User>().Count(u => u.Role == ERole.InternshipHandler);
            if (adminNum < 1)
            {
                var user = new User
                {
                    Email = "handler@mail.com", 
                    Role = ERole.InternshipHandler,
                    FirstName = "Admin",
                    LastName = "User",
                };
                var passwordHash = BCrypt.Net.BCrypt.EnhancedHashPassword("12345678");
                user.PasswordHash = passwordHash;
                context.Set<User>().Add(user);
                context.SaveChanges();
            }
        })
        .UseAsyncSeeding(async (context, _, cancellationToken) =>
        {
            var adminNum = context.Set<User>().Count(u => u.Role == ERole.InternshipHandler);
            if (adminNum < 1)
            {
                var user = new User
                {
                    Email = "handler@mail.com", 
                    Role = ERole.InternshipHandler,
                    FirstName = "Admin",
                    LastName = "User",
                };
                var passwordHash = BCrypt.Net.BCrypt.EnhancedHashPassword("12345678");
                user.PasswordHash = passwordHash;
                context.Set<User>().Add(user);
                await context.SaveChangesAsync(cancellationToken);
            }
        });
    }
}