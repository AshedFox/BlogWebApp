using System;
using System.Collections.Generic;

namespace BlogWebApp.DTOs
{
    public class GetPostsResultDto
    {
        public List<PostDto> Posts { get; set; }
        public int MaxPage { get; set; }
    }
}