using System;
using System.Collections.Generic;

namespace BlogWebApp.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<PostDto> Posts { get; set; } = new List<PostDto>();
    }
}