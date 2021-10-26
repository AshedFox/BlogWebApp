using System;

namespace BlogWebApp.DTOs
{
    public class PostDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserDto Creator { get; set; }
        public string Content { get; set; }
    }
}