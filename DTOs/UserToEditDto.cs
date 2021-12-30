using System;
using System.ComponentModel.DataAnnotations;
using BlogWebApp.Models;

namespace BlogWebApp.DTOs
{
    public class UserToEditDto
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Name { get; set; }
        [StringLength(1000, MinimumLength = 1)]
        public string SelfInformation { get; set; }
        public DateTime? BornAt { get; set; }
        public UserGender Gender { get; set; }
    }
}