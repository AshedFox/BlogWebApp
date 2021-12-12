using System;

namespace BlogWebApp.Models
{
    public class CommentMark
    {
        public byte Value { get; set; }
    
        public virtual Guid UserId { get; set; }
        public virtual User User { get; set; }
    
        public virtual Guid CommentId { get; set; }
        public virtual Comment Comment { get; set; }
    }
}