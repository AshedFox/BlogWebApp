using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlogWebApp.Models
{
    public class Comment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public string Content { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        
        [Required]
        [ForeignKey(nameof(Creator))]
        public virtual Guid CreatorId { get; set; }
        public virtual User Creator { get; set; }
        
        [Required]
        [ForeignKey(nameof(Post))]
        public virtual Guid PostId { get; set; }
        public virtual Post Post { get; set; }

        [ForeignKey(nameof(ParentComment))]
        public virtual Guid? ParentCommentId { get; set; }
        public virtual Comment ParentComment { get; set; }
        
        public virtual ICollection<CommentMark> Marks { get; set; } = new List<CommentMark>();
    }
}