using System;
using System.Collections.Generic;

namespace BlogWebApp.DTOs
{
    public class CommentDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public ShortUserDto Creator { get; set; }
        public PostDto Post { get; set; }
        public ICollection<CommentMarkDto> Marks { get; set; }
        public CommentDto ParentComment { get; set; }
    }
}