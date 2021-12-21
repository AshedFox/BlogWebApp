using System;
using System.ComponentModel.DataAnnotations;

namespace BlogWebApp.DTOs
{
    public class PostToEditDto
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Title { get; set; }
        [MinLength(1)]
        public string Content { get; set; }
    }
}