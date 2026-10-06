using Microsoft.AspNetCore.Identity;

namespace Ent.Web.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Add custom properties here if needed, such as FirstName, LastName, etc.
        public string? FullName { get; set; }
    }
}
