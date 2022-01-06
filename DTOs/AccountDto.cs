using System;

namespace BlogWebApp.DTOs
{
    public class AccountDto
    {
        public Guid UserId { get; set; }
        public DateTime AccessTokenExpiredAt { get; set; }
        public DateTime RefreshTokenExpiredAt { get; set; }
    }
}