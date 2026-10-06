using System;
using System.ComponentModel.DataAnnotations;

namespace Ent.Web.Models
{
    public class BlogPost
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string AuthorName { get; set; } = string.Empty;

        public DateTime PublishedDate { get; set; } = DateTime.UtcNow;

        public bool IsPublished { get; set; } = true;
    }
}
