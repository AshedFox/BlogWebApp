using System;

namespace BlogWebApp.DTOs
{
    public class ShortUserDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public FileDto Avatar { get; set; }
    }
}