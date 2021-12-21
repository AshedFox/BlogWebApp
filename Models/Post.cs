using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Runtime.Serialization;

namespace BlogWebApp.Models
{
    public class Post
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Title { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; }
        [Required]
        [MinLength(1)]
        public string Content { get; set; }

        [Required]
        [ForeignKey(nameof(Creator))]
        public virtual Guid CreatorId { get; set; }
        public virtual User Creator { get; set; }
        
        [ForeignKey(nameof(Cover))]
        public virtual Guid? CoverId { get; set; }
        public virtual File Cover { get; set; }

        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public virtual ICollection<User> UsersMarked { get; set; } = new List<User>();
        public virtual ICollection<PostMark> Marks { get; set; } = new List<PostMark>();

    }
}