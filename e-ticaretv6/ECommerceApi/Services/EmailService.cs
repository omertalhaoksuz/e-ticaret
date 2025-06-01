using ECommerceApi.Dtos;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System.Threading.Tasks;

namespace ECommerceApi.Services
{
    public class EmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IConfiguration config)
        {
            _settings = config.GetSection("Smtp").Get<EmailSettings>();
        }

        public async Task SendInvoiceEmailAsync(string toEmail, byte[] pdfBytes, string filename)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("E-Commerce App", _settings.User));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = "Your Invoice";

            var builder = new BodyBuilder
            {
                TextBody = "Your invoice is attached as PDF."
            };

            builder.Attachments.Add(filename, pdfBytes, new ContentType("application", "pdf"));
            message.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_settings.User, _settings.Password);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
    }
}
