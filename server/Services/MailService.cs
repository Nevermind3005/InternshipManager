using FluentEmail.Core;
using FluentEmail.Core.Models;

namespace server.Services;

public class MailService(
    IFluentEmail fluentEmail
    ) 
    : IMailService
{
    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        await fluentEmail
            .To(toEmail)
            .Subject(subject)
            .Body(body)
            .SendAsync();
    }

    public async Task SendMailTemplateAsync<T>(string toEmail, string subject, string templatePath, T model)
    {
        await SendMailTemplateAsync([new Address(toEmail, "")], subject, templatePath, model);
    }

    public async Task SendMailTemplateAsync<T>(IEnumerable<Address> toEmail, string subject, string templatePath, T model)
    {
        await fluentEmail
            .To(toEmail)
            .Subject(subject)
            .UsingTemplateFromFile(templatePath, model)
            .SendAsync();
    }
}