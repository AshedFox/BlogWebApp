using System;
using System.Collections.Generic;
using BlogWebApp.Models;

namespace BlogWebApp.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public string SelfInformation { get; set; }
        public DateTime? BornAt { get; set; }
        public UserGender Gender { get; set; }
        public FileDto Avatar { get; set; }
        public ICollection<PostDto> Posts { get; set; } = new List<PostDto>();
    }
}