using System;
using System.ComponentModel.DataAnnotations;

namespace BlogWebApp.DTOs
{
    public class CommentToEditDto
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public string Content { get; set; }
    }
}