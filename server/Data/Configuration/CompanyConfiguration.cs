using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.Configuration;

public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.HasMany(c => c.Internships)
            .WithOne(i => i.Company)
            .HasForeignKey(i => i.CompanyId)
            .IsRequired()
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(c => c.Representatives)
            .WithOne()
            .HasForeignKey(u => u.CompanyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}