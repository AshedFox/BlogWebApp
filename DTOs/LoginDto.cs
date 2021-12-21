using System.ComponentModel.DataAnnotations;

namespace BlogWebApp.DTOs
{
    public class LoginDto
    {
        [Required]
        [StringLength(320, MinimumLength = 5)]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }
    }
}