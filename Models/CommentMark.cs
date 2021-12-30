using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlogWebApp.Models
{
    public class CommentMark
    {
        [Key]
        [Required] 
        public Guid Id { get; set; }
        
        [Required]
        public byte Value { get; set; }
    
        [Required]
        [ForeignKey(nameof(User))]
        public virtual Guid UserId { get; set; }
        public virtual User User { get; set; }
    
        [Required]
        [ForeignKey(nameof(Comment))]
        public virtual Guid CommentId { get; set; }
        public virtual Comment Comment { get; set; }
    }
}