using Ent.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace Ent.Web.Pages
{
    public class ContactModel : PageModel
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<ContactModel> _logger;

        public ContactModel(IEmailService emailService, ILogger<ContactModel> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        [BindProperty]
        public ContactFormModel ContactForm { get; set; } = new ContactFormModel();

        public bool IsSuccess { get; set; }
        public bool IsError { get; set; }

        public class ContactFormModel
        {
            [Required]
            public string Name { get; set; } = string.Empty;

            [Required]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;

            [Required]
            [StringLength(200)]
            public string Subject { get; set; } = string.Empty;

            [Required]
            [StringLength(1000, MinimumLength = 10)]
            public string Message { get; set; } = string.Empty;
        }

        public void OnGet(string? subject)
        {
            IsSuccess = false;
            IsError = false;

            if (!string.IsNullOrEmpty(subject))
            {
                ContactForm.Subject = subject;
            }
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            // Determine whether this is a job application (pre-filled via ?subject=Application for ...)
            // or a general contact enquiry, and build distinct email subjects accordingly.
            bool isApplication = ContactForm.Subject.StartsWith("Application for", StringComparison.OrdinalIgnoreCase);

            string emailSubject = isApplication
                ? $"[Career Application] {ContactForm.Subject}"
                : $"[Contact Enquiry] {ContactForm.Subject}";

            string body = ContactForm.Message;

            try
            {
                await _emailService.SendAsync(
                    ContactForm.Name,
                    ContactForm.Email,
                    emailSubject,
                    body
                );

                IsSuccess = true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Contact form email delivery failed for {Email}", ContactForm.Email);
                IsError = true;
            }

            return Page();
        }
    }
}
