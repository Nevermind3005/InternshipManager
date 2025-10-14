using Microsoft.EntityFrameworkCore;

namespace server.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
}