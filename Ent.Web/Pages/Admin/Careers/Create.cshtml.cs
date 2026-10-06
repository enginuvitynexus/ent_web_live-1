using Ent.Web.Data;
using Ent.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Threading.Tasks;

namespace Ent.Web.Pages.Admin.Careers
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
        public CareerListing CareerListing { get; set; } = new CareerListing();

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.CareerListings.Add(CareerListing);
            await _context.SaveChangesAsync();

            return RedirectToPage("./Index");
        }
    }
}
