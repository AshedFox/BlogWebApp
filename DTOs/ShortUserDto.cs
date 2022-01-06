using System;
using BlogWebApp.Models;

namespace BlogWebApp.DTOs
{
    public class ShortUserDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public FileDto Avatar { get; set; }
        public DateTime CreatedAt { get; set; }
        public string SelfInformation { get; set; }
        public DateTime? BornAt { get; set; }
        public UserGender Gender { get; set; }
    }
}