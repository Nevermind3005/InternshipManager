using FluentEmail.Core.Models;

namespace server.Services;

// TODO allow sending mail to more addresses at once
public interface IMailService
{
    public Task SendEmailAsync(string toEmail, string subject, string body);
    public Task SendMailTemplateAsync<T>(string toEmail, string subject, string templatePath, T model);
    public Task SendMailTemplateAsync<T>(IEnumerable<Address> toEmail, string subject, string templatePath, T model);
}