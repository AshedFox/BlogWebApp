using System;
using System.Collections.Generic;

namespace BlogWebApp.DTOs
{
    public class PostDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime CreatedAt { get; set; }
        public FileDto Cover { get; set; }
        public string Content { get; set; }
        public int TotalMark { get; set; }
        public int MarksCount { get; set; }
        public ShortUserDto Creator { get; set; }
    }
}