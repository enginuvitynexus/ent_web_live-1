using Ent.Web.Data;
using Ent.Web.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ent.Web.Pages.Admin.Blog
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
            BlogPosts = await _context.BlogPosts.ToListAsync();
        }
    }
}
