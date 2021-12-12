using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace BlogWebApp.Auth
{
    public class TokensGenerator
    {
        public static string GenerateAccessToken(string userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var credentials =
                new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new(JwtRegisteredClaimNames.Sub, userId),
                }),
                Expires = DateTime.UtcNow.AddMinutes(AuthOptions.AccessTokenLifetime),
                Issuer = AuthOptions.Issuer,
                Audience = AuthOptions.Audience,
                SigningCredentials = credentials
            };

            return new JwtSecurityTokenHandler().WriteToken(tokenHandler.CreateJwtSecurityToken(tokenDescriptor)) ;
        }

        public static string GenerateRefreshToken() => Guid.NewGuid().ToString();
    }
}