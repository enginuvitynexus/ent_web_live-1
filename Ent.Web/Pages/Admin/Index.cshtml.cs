using Ent.Web.Data;
using Ent.Web.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Ent.Web.Pages.Admin
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public IndexModel(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public int TotalUsers { get; set; }
        public int TotalBlogs { get; set; }
        public int TotalCareers { get; set; }

        public async Task OnGetAsync()
        {
            TotalUsers = await _userManager.Users.CountAsync();
            TotalBlogs = await _context.BlogPosts.CountAsync(b => b.IsPublished);
            TotalCareers = await _context.CareerListings.CountAsync(c => c.IsActive);
        }
    }
}
