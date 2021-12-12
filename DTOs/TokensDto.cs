using System;

namespace BlogWebApp.DTOs
{
    public class TokensDto
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}