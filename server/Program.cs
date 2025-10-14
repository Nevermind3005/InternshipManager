using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using server.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Register the database ctx
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    // Use snake case naming (preferred by postgres)
    options.UseNpgsql(builder.Configuration.GetConnectionString("InternshipDatabase")).UseSnakeCaseNamingConvention();
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();