using Asp.Versioning;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using server.Data;
using server.Foundation.Configuration;
using server.Services;

const string corsAllowFrontendPolicy = "AllowFrontend";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.Configure<AuthConfiguration>(builder.Configuration.GetSection("Auth"));

// Register the database ctx
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    // Use snake case naming (preferred by postgres)
    options.UseNpgsql(builder.Configuration.GetConnectionString("InternshipDatabase")).UseSnakeCaseNamingConvention();
});

builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsAllowFrontendPolicy, policy =>
    {
        var consumers = builder.Configuration.GetRequiredSection("Consumers")["FrontendURL"];

        if (string.IsNullOrEmpty(consumers))
        {
            throw new InvalidOperationException("Configuration value 'Consumers->FrontendURL' is missing.");
        }
        
        policy.WithOrigins(consumers)
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1);
    options.ReportApiVersions = true;
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new HeaderApiVersionReader("X-Api-Version")
    );
}).AddMvc();

builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

app.UseCors(corsAllowFrontendPolicy);

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