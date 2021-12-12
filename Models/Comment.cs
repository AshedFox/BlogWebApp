using System;
using System.Collections.Generic;

namespace BlogWebApp.Models
{
    public class Comment
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        
        public virtual Guid CreatorId { get; set; }
        public virtual User Creator { get; set; }
        
        public virtual Guid PostId { get; set; }
        public virtual Post Post { get; set; }

        public virtual Guid? ParentCommentId { get; set; }
        public virtual Comment ParentComment { get; set; }
        
        public virtual ICollection<CommentMark> Marks { get; set; } = new List<CommentMark>();
        public virtual ICollection<User> UsersMarked { get; set; } = new List<User>();

    }
}