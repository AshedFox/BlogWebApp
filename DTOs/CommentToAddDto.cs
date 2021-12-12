using System;

namespace BlogWebApp.DTOs
{
    public class CommentToAddDto
    {
        public Guid PostId { get; set; }
        public Guid CreatorId { get; set; }
        public Guid? ParentCommentId { get; set; }
        public string Content { get; set; }
    }
}