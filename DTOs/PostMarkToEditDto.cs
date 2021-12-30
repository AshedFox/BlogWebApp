using System;
using System.ComponentModel.DataAnnotations;

namespace BlogWebApp.DTOs
{
    public class PostMarkToEditDto
    {
        [Required]
        public Guid Id { get; set; }
        [Range(0, 1)]
        [Required]
        public byte Value { get; set; }
    }
}