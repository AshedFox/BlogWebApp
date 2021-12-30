using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlogWebApp.Models
{
    public class RefreshToken
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public DateTime ExpiredAt { get; set; }

        [Required]
        [ForeignKey(nameof(User))]
        public virtual Guid UserId { get; set; }
        public User User { get; set; }
    }
}