using System;
using System.ComponentModel.DataAnnotations;

namespace BlogWebApp.DTOs
{
    public class CommentToAddDto
    {
        [Required]
        public Guid PostId { get; set; }
        [Required]
        public Guid CreatorId { get; set; }
        public Guid? ParentCommentId { get; set; }
        [Required]
        [StringLength(1000, MinimumLength = 1)]
        public string Content { get; set; }
    }
}