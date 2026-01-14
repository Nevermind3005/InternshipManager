using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.Configuration;

public class InternshipDocumentConfiguration : IEntityTypeConfiguration<InternshipDocument>
{
    public void Configure(EntityTypeBuilder<InternshipDocument> builder)
    {
        builder.Property(d => d.Slot).HasConversion<string>();
        builder.Property(d => d.UploadedBy).HasConversion<string>();
        
        builder.HasOne(d => d.Internship)
            .WithMany(i => i.Documents)
            .HasForeignKey(d => d.InternshipId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasIndex(d => new { d.InternshipId, d.Slot, d.UploadedBy });
    }
}
