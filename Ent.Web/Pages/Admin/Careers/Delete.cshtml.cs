using Ent.Web.Data;
using Ent.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Ent.Web.Pages.Admin.Careers
{
    public class DeleteModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public DeleteModel(ApplicationDbContext context)
        {
            _context = context;
        }

        [BindProperty]
        public CareerListing CareerListing { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var listing = await _context.CareerListings.FirstOrDefaultAsync(m => m.Id == id);

            if (listing == null)
            {
                return NotFound();
            }
            else
            {
                CareerListing = listing;
            }
            return Page();
        }

        public async Task<IActionResult> OnPostAsync(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var listing = await _context.CareerListings.FindAsync(id);
            if (listing != null)
            {
                CareerListing = listing;
                _context.CareerListings.Remove(CareerListing);
                await _context.SaveChangesAsync();
            }

            return RedirectToPage("./Index");
        }
    }
}
