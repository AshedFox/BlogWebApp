using System.ComponentModel.DataAnnotations;

namespace BlogWebApp.DTOs
{
    public class SignUpDto
    {
        [Required]
        [StringLength(320, MinimumLength = 5)]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Name { get; set; }
    }
}