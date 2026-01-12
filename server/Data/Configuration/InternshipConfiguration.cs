using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.Configuration;

public class InternshipConfiguration : IEntityTypeConfiguration<Internship>
{
    public void Configure(EntityTypeBuilder<Internship> builder)
    {
        builder.Property(i => i.Semester).HasConversion<string>();
        builder.Property(i => i.State).HasConversion<string>();
        
        builder.HasOne(i => i.StudyProgram)
            .WithMany(sp => sp.Internships)
            .HasForeignKey(i => i.StudyProgramId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}