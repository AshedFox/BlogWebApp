using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace BlogWebApp.Models
{
    public class Post
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Required]
        public string Title { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; }
        [Required]
        public string Content { get; set; }

        public virtual Guid CreatorId { get; set; }
        public virtual User Creator { get; set; }
        
        public virtual Guid? CoverId { get; set; }
        public virtual File Cover { get; set; }

        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public virtual ICollection<User> UsersMarked { get; set; } = new List<User>();
        public virtual ICollection<PostMark> Marks { get; set; } = new List<PostMark>();

    }
}