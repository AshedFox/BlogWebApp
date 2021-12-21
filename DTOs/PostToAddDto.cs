using System;
using System.ComponentModel.DataAnnotations;

namespace BlogWebApp.DTOs
{
    public class PostToAddDto
    {
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Title { get; set; }
        [Required]
        public Guid CreatorId { get; set; }
        [Required]
        [MinLength(1)]
        public string Content { get; set; }
        public Guid? CoverId { get; set; }
    }
}