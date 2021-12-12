using System;

namespace BlogWebApp.DTOs
{
    public class CommentToEditDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
    }
}