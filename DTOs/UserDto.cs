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
        public virtual ICollection<PostDto> CreatedPosts { get; set; } = new List<PostDto>();
        public virtual ICollection<PostMarkDto> PostsMarks { get; set; } = new List<PostMarkDto>();
        public virtual ICollection<CommentDto> CreatedComments { get; set; } = new List<CommentDto>();
        public virtual ICollection<CommentMarkDto> CommentsMarks { get; set; } = new List<CommentMarkDto>();
    }
}