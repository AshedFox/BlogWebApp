using System;
using System.ComponentModel.DataAnnotations;

namespace BlogWebApp.DTOs
{
    public class CommentMarkToAddDto
    {
        [Range(0, 1)]
        [Required]
        public byte Value { get; set; }
        [Required]
        public Guid CommentId { get; set; }
        [Required]
        public Guid UserId { get; set; }
    }
}