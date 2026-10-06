using Ent.Web.Data;
using Ent.Web.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ent.Web.Pages.Blog
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public IList<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();

        public async Task OnGetAsync()
        {
            try
            {
                BlogPosts = await _context.BlogPosts
                    .Where(b => b.IsPublished)
                    .OrderByDescending(b => b.PublishedDate)
                    .ToListAsync();
            }
            catch (System.Exception)
            {
                // If the database is not available, default to an empty list to show no blog posts
                BlogPosts = new List<BlogPost>();
            }
        }
    }
}
