using System;

namespace BlogWebApp.DTOs
{
    public class PostMarkDto
    {
        public Guid Id { get; set; }
        public byte Value { get; set; }
        public Guid PostId { get; set; }
        public Guid UserId { get; set; }
    }
}