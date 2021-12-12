using System;

namespace BlogWebApp.DTOs
{
    public class CommentDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public ShortUserDto Creator { get; set; }
        public PostDto Post { get; set; }
        public int TotalMark { get; set; }
        public int MarksCount { get; set; }
        public CommentDto ParentComment { get; set; }
    }
}