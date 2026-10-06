using Ent.Web.Data;
using Ent.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Threading.Tasks;

namespace Ent.Web.Pages.Admin.Blog
{
    public class CreateModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public CreateModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult OnGet()
        {
            return Page();
        }

        [BindProperty]
        public BlogPost BlogPost { get; set; } = new BlogPost();

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.BlogPosts.Add(BlogPost);
            await _context.SaveChangesAsync();

            return RedirectToPage("./Index");
        }
    }
}
