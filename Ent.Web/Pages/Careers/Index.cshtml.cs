using Ent.Web.Data;
using Ent.Web.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ent.Web.Pages.Careers
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public IndexModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public IList<CareerListing> Careers { get; set; } = new List<CareerListing>();

        public async Task OnGetAsync()
        {
            try
            {
                Careers = await _context.CareerListings
                    .Where(c => c.IsActive)
                    .OrderByDescending(c => c.PostedDate)
                    .ToListAsync();
            }
            catch (System.Exception)
            {
                // If the database is not available, default to an empty list to show no vacancies
                Careers = new List<CareerListing>();
            }
        }
    }
}
