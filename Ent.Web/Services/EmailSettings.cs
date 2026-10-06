namespace Ent.Web.Services
{
    /// <summary>
    /// Strongly-typed SMTP / email configuration.
    /// Bound from appsettings.json → "EmailSettings".
    /// </summary>
    public class EmailSettings
    {
        /// <summary>SMTP server hostname (e.g. smtp.gmail.com)</summary>
        public string SmtpHost { get; set; } = string.Empty;

        /// <summary>SMTP port (587 for TLS/STARTTLS, 465 for SSL)</summary>
        public int SmtpPort { get; set; } = 587;

        /// <summary>Set true when using port 465 (SSL). Leave false for STARTTLS (port 587).</summary>
        public bool UseSsl { get; set; } = false;

        /// <summary>SMTP login username (usually the full email address)</summary>
        public string SmtpUser { get; set; } = string.Empty;

        /// <summary>SMTP login password or App Password</summary>
        public string SmtpPassword { get; set; } = string.Empty;

        /// <summary>Display name shown in the From field of outgoing emails</summary>
        public string SenderName { get; set; } = "Enginuvity Nexus Website";

        /// <summary>From address on outgoing emails (must be authorised on your SMTP server)</summary>
        public string SenderEmail { get; set; } = string.Empty;

        /// <summary>The support inbox that receives all contact/enquiry emails</summary>
        public string RecipientEmail { get; set; } = "support@enginuvitynexus.com";
    }
}
