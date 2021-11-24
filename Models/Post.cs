using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace BlogWebApp.Models
{
    public class Post
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Required]
        public string Title { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; }
        [Required]
        public string Content { get; set; }

        public virtual Guid CreatorId { get; set; }
        public virtual User Creator { get; set; }
        
        public virtual Guid? CoverId { get; set; }
        public virtual File Cover { get; set; }
    }
}