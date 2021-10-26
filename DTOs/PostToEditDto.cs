using System;

namespace BlogWebApp.DTOs
{
    public class PostToEditDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }
}