using Ent.Web.Data;
using Ent.Web.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ent.Web.Pages.Admin.Careers
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public IList<CareerListing> CareerListings { get; set; } = new List<CareerListing>();

        public async Task OnGetAsync()
        {
            CareerListings = await _context.CareerListings.ToListAsync();
        }
    }
}
