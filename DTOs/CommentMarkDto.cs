using System;

namespace BlogWebApp.DTOs
{
    public class CommentMarkDto
    {
        public Guid Id { get; set; }
        public byte Value { get; set; }
        public Guid CommentId { get; set; }
        public CommentDto Comment { get; set; }
        public Guid UserId { get; set; }
        public ShortUserDto User { get; set; }
    }
}