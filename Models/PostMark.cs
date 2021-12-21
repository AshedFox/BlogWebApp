using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlogWebApp.Models
{
    public class PostMark
    {
        [Required]
        public byte Value { get; set; }
        
        [Required]
        [ForeignKey(nameof(User))]
        public virtual Guid UserId { get; set; }
        public virtual User User { get; set; }
        
        [Required]
        [ForeignKey(nameof(Post))]
        public virtual Guid PostId { get; set; }
        public virtual Post Post { get; set; }
    }
}