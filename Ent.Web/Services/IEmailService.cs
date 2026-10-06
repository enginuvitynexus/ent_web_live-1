namespace Ent.Web.Services
{
    public interface IEmailService
    {
        /// <summary>
        /// Sends an email to the support inbox.
        /// </summary>
        /// <param name="senderName">Full name of the person submitting the form.</param>
        /// <param name="senderEmail">Email address of the person submitting the form.</param>
        /// <param name="subject">Email subject (already formatted with the appropriate prefix).</param>
        /// <param name="body">Plain-text body of the email.</param>
        Task SendAsync(string senderName, string senderEmail, string subject, string body);
    }
}
