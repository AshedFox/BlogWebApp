using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlogWebApp.Models
{
    public class File
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Name { get; set; }
        [Required]
        [DataType(DataType.Url)]
        public string Url { get; set; }
    }
}