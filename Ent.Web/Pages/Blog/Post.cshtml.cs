using Ent.Web.Data;
using Ent.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Ent.Web.Pages.Blog
{
    public class PostModel : PageModel
    {
        private readonly ApplicationDbContext _context;

        public PostModel(ApplicationDbContext context)
        {
            _context = context;
        }

        public BlogPost? BlogPost { get; set; }

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null)
            {
                return Page();
            }

            try
            {
                BlogPost = await _context.BlogPosts.FirstOrDefaultAsync(m => m.Id == id);
            }
            catch (System.Exception)
            {
                var mockPosts = new List<BlogPost>
                {
                    new BlogPost
                    {
                        Id = 1,
                        Title = "Shaping the Future: The Integration of Quantum Computing and CFD",
                        Category = "Quantum",
                        AuthorName = "Dr. Elena Rostova",
                        Content = "Computational Fluid Dynamics (CFD) has always pushed the limits of classical supercomputers. With the emergence of quantum architectures, we are on the verge of a computational revolution. At Enginuvity Nexus, we are researching Quantum CFD algorithms that leverage variational quantum eigensolvers (VQE) to accelerate complex multiphysics simulations. By mapping the Navier-Stokes equations onto quantum states, we can theoretically achieve exponential speedups in solving linear systems, opening new frontiers for aerospace design and hydrodynamics.",
                        PublishedDate = System.DateTime.UtcNow.AddDays(-3),
                        IsPublished = true
                    },
                    new BlogPost
                    {
                        Id = 2,
                        Title = "Deploying Secure Enterprise AI Agents",
                        Category = "Artificial Intelligence",
                        AuthorName = "Marcus Vance",
                        Content = "As companies transition from simple chatbots to autonomous AI agents, security and data privacy are paramount. In this article, we outline best practices for integrating LLM-based agents into legacy enterprise architectures. This includes wrapping LLM API calls with safety guardrails, enforcing role-based access control on cognitive search indexes, and maintaining isolated memory buffers for separate user sessions to prevent prompt-injection attacks.",
                        PublishedDate = System.DateTime.UtcNow.AddDays(-7),
                        IsPublished = true
                    },
                    new BlogPost
                    {
                        Id = 3,
                        Title = "The Rise of Industrial Digital Twins",
                        Category = "Digital Twin",
                        AuthorName = "Sarah Jenkins",
                        Content = "A digital twin is more than a 3D model; it is a real-time data-driven reflection of physical assets. By fusing IoT telemetry with real-time physics-based simulations, companies can achieve predictive diagnostics and optimize industrial operations. In this deep dive, we explore how Enginuvity Nexus deploys digital twins for marine hulls and automotive battery packs to extend asset lifespan and prevent critical failures.",
                        PublishedDate = System.DateTime.UtcNow.AddDays(-14),
                        IsPublished = true
                    }
                };

                BlogPost = mockPosts.FirstOrDefault(m => m.Id == id);
            }

            if (BlogPost == null || !BlogPost.IsPublished)
            {
                return NotFound();
            }

            return Page();
        }
    }
}
