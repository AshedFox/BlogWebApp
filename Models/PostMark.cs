using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlogWebApp.Models
{
    public class PostMark
    {
        public byte Value { get; set; }
        
        public virtual Guid UserId { get; set; }
        public virtual User User { get; set; }
        
        public virtual Guid PostId { get; set; }
        public virtual Post Post { get; set; }
    }
}