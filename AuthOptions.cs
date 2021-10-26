using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace BlogWebApp
{
    public class AuthOptions
    {
        public const string Issuer = "Chat.Backend.Api.Server";
        public const string Audience = "Chat.Client";
        private const string Key = "ZGMwYTJkM2I1OWRjZTI5YzIxY2NmODVmNTM2MzBhOTJjYjA0NWJiNTdiY2UxMzcxY2Q3YWQzMDE3ZWNlMWMzYmE3NjdiYjJiNDhkNDEyMzBkMjVhODgzZjg4MDY1YzZiODNjMDAxNDU2NjBiYjA0NzViOTU5ZDA0ZGJlNjY1OWU";
        public const int Lifetime = 30; // Lifetime in minutes
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Key));
        }
    }
}