using System;

namespace BlogWebApp.DTOs
{
    public class PostUserDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public FileDto Avatar { get; set; }
    }
}