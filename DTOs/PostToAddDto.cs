using System;

namespace BlogWebApp.DTOs
{
    public class PostToAddDto
    {
        public string Title { get; set; }
        public Guid CreatorId { get; set; }
        public string Content { get; set; }
        public Guid? CoverId { get; set; }
    }
}