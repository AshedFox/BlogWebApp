using System;

namespace BlogWebApp.DTOs
{
    public class LoginResultDto
    {
        public UserDto User { get; set; }
        public string AuthToken { get; set; }
        public DateTime TokenValidTo { get; set; }
    }
}