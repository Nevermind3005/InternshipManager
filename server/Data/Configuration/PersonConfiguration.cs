using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.Configuration;

public class PersonConfiguration : IEntityTypeConfiguration<Person>
{
    public void Configure(EntityTypeBuilder<Person> builder)
    {
        builder.HasOne(e => e.User)
            .WithOne(e => e.Person)
            .HasForeignKey<User>(e => e.PersonId)
            .IsRequired();
    }
}