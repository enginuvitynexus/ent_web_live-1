using System;
using System.ComponentModel.DataAnnotations;

namespace Ent.Web.Models
{
    public class CareerListing
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string JobTitle { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Department { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Location { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public DateTime PostedDate { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;
    }
}
