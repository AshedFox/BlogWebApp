using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlogWebApp.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Required]
        [StringLength(320, MinimumLength = 5)]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string PasswordHash { get; set; }
        [Required]
        public string Salt { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Name { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; }
        
        [StringLength(1000, MinimumLength = 1)]
        public string SelfInformation { get; set; }
        public DateTime? BornAt { get; set; }
        public UserGender Gender { get; set; }

        [ForeignKey(nameof(Avatar))]
        public virtual Guid? AvatarId { get; set; }
        public virtual File Avatar { get; set; }
        
        public virtual ICollection<Post> CreatedPosts { get; set; } = new List<Post>();
        public virtual ICollection<Post> MarkedPosts { get; set; } = new List<Post>();
        public virtual ICollection<PostMark> PostsMarks { get; set; } = new List<PostMark>();    
        public virtual ICollection<Comment> CreatedComments { get; set; } = new List<Comment>();
        public virtual ICollection<Comment> MarkedComments { get; set; } = new List<Comment>();
        public virtual ICollection<CommentMark> CommentsMarks { get; set; } = new List<CommentMark>();    
    }
}