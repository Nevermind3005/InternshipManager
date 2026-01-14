using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.Configuration;

public class StudyProgramConfiguration : IEntityTypeConfiguration<StudyProgram>
{
    public void Configure(EntityTypeBuilder<StudyProgram> builder)
    {
        builder.HasKey(sp => sp.Id);
        builder.Property(sp => sp.Code).IsRequired().HasMaxLength(16);
        builder.HasIndex(sp => sp.Code).IsUnique();
    }
}
