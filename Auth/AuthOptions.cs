using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace BlogWebApp.Auth
{
    public class AuthOptions
    {
        public const string Issuer = "BlogWebApp.Server";
        public const string Audience = "BlogWebApp.Client";
        private const string Key = "ZGMwYTJkM2I1OWRjZTI5YzIxY2NmODVmNTM2MzBhOTJjYjA0NWJiNTdiY2UxMzcxY2Q3YWQzMDE3ZWNlMWMzYmE3NjdiYjJiNDhkNDEyMzBkMjVhODgzZjg4MDY1YzZiODNjMDAxNDU2NjBiYjA0NzViOTU5ZDA0ZGJlNjY1OWU";
        public const int AccessTokenLifetime = 5; // Lifetime in minutes
        public const int RefreshTokenLifetime = 14; // Lifetime in days
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Key));
        }
    }
}