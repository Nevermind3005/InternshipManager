using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.Configuration;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(u => u.Role).HasConversion<string>();
        builder.HasIndex(u => u.Email).IsUnique();

        builder.HasMany(u => u.StudentInternships)
            .WithOne(i => i.Student)
            .HasForeignKey(i => i.StudentId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(u => u.RepresentativeInternships)
            .WithOne(i => i.CompanyRepresentative)
            .HasForeignKey(i => i.CompanyRepresentativeId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}