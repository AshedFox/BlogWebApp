using System;
using System.ComponentModel.DataAnnotations;

namespace BlogWebApp.DTOs
{
    public class PostMarkToAddDto
    {
        [Range(0, 1)]
        [Required]
        public byte Value { get; set; }
        [Required]
        public Guid PostId { get; set; }
        [Required]
        public Guid UserId { get; set; }
    }
}