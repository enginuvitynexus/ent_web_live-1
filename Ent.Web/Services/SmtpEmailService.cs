using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Options;

namespace Ent.Web.Services
{
    /// <summary>
    /// Concrete SMTP email service backed by MailKit.
    /// Configuration is read from appsettings.json under the "EmailSettings" key.
    /// </summary>
    public class SmtpEmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<SmtpEmailService> _logger;

        public SmtpEmailService(IOptions<EmailSettings> settings, ILogger<SmtpEmailService> logger)
        {
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task SendAsync(string senderName, string senderEmail, string subject, string body)
        {
            try
            {
                var message = new MimeMessage();

                // From: the configured sender identity
                message.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));

                // To: the support inbox
                message.To.Add(new MailboxAddress("Enginuvity Nexus Support", _settings.RecipientEmail));

                // Reply-To: the website visitor so replies go directly to them
                message.ReplyTo.Add(new MailboxAddress(senderName, senderEmail));

                message.Subject = subject;

                // Plain-text body – include the submitter's details
                var textBody = $"Name:    {senderName}\r\nEmail:   {senderEmail}\r\n\r\n{body}";
                message.Body = new TextPart("plain") { Text = textBody };

                using var client = new SmtpClient();
                await client.ConnectAsync(_settings.SmtpHost, _settings.SmtpPort,
                    _settings.UseSsl ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTlsWhenAvailable);

                if (!string.IsNullOrEmpty(_settings.SmtpUser))
                {
                    await client.AuthenticateAsync(_settings.SmtpUser, _settings.SmtpPassword);
                }

                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("Email sent | Subject: {Subject} | From: {Email}", subject, senderEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email | Subject: {Subject} | From: {Email}", subject, senderEmail);
                throw;
            }
        }
    }
}
