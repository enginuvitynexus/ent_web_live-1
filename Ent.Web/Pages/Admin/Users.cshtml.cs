using Ent.Web.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ent.Web.Pages.Admin
{
    public class UsersModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UsersModel(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public class UserViewModel
        {
            public string Id { get; set; } = string.Empty;
            public string FullName { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public IList<string> Roles { get; set; } = new List<string>();
        }

        public IList<UserViewModel> UsersList { get; set; } = new List<UserViewModel>();

        public async Task OnGetAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                UsersList.Add(new UserViewModel
                {
                    Id = user.Id,
                    FullName = user.FullName ?? "Unknown",
                    Email = user.Email ?? "Unknown",
                    Roles = roles
                });
            }
        }

        public async Task<IActionResult> OnPostChangeRoleAsync(string UserId, string NewRole)
        {
            var user = await _userManager.FindByIdAsync(UserId);
            if (user != null)
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, NewRole);
            }
            return RedirectToPage();
        }
    }
}
