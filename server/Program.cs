using System.Net.Mail;
using System.Text;
using Asp.Versioning;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using server.Data;
using server.Foundation.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using server.Foundation.Utils;
using server.Services;

const string corsAllowFrontendPolicy = "AllowFrontend";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.Configure<AuthConfiguration>(builder.Configuration.GetSection("Auth"));
builder.Services.Configure<S3Configuration>(builder.Configuration.GetSection("S3"));

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

#region AuthRegion
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration.GetValue<string>("Auth:Issuer"),
            ValidateAudience = true,
            ValidAudience = builder.Configuration.GetValue<string>("Auth:Audience"),
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("Auth:SigningKey")!)),
            ClockSkew = TimeSpan.Zero // No delay when validating JWT expiration date time as we are not doing microservices
        };
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy(AuthStatics.PolicyNoDefaultPassword, policy =>
    {
        policy.RequireAssertion(context =>
        {
            // Do not check if password is default if the user is an application
            if (context.User.IsInRole(nameof(ERole.ExternalApplication)))
            {
                return true;
            }

            return context.User.HasClaim("IsPasswordDirty", "False");
        });
    });
#endregion

builder.Services.AddFluentEmail(builder.Configuration.GetValue<string>("Mail:From"), builder.Configuration.GetValue<string>("Mail:Name"))
    .AddRazorRenderer()
    .AddSmtpSender(() => new SmtpClient(builder.Configuration.GetValue<string>("Mail:Host"), builder.Configuration.GetValue<int>("Mail:Port"))
    {
        DeliveryMethod = SmtpDeliveryMethod.Network,
        EnableSsl = false,
        UseDefaultCredentials = false
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

builder.Services.AddDetection();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IInternshipService, InternshipService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IApplicationService, ApplicationService>();
builder.Services.AddTransient<IMailService, MailService>();
builder.Services.AddSingleton<IS3Service, S3Service>();

var app = builder.Build();

app.UseDetection();

app.UseCors(corsAllowFrontendPolicy);

app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference((options, context) =>
    {
        options.AddServer(new ScalarServer($"https://{context.Request.Host}"));
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();