using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using BlogWebApp.Data;
using BlogWebApp.DTOs;
using BlogWebApp.Models;
using Isopoh.Cryptography.Argon2;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BlogWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly PostgresDbContext _context;
        private readonly IMapper _mapper;

        public AccountController(PostgresDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Account/Login
        [HttpPost("[action]")]
        public async Task<ActionResult<LoginResultDto>> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users.Where(user => user.Email == loginDto.Email).FirstOrDefaultAsync();

            if (user is null)
            {
                return NotFound();
            }

            var argon2Config = GenerateArgon2Config(loginDto.PasswordHash, user.Salt);
            if (!Argon2.Verify(user.PasswordHash, argon2Config))
            {
                return Unauthorized();
            }
            
            var token = GenerateToken(user.Id);

            var authResultDto = new LoginResultDto()
            {
                User = _mapper.Map<User, UserDto>(user),
                AuthToken = new JwtSecurityTokenHandler().WriteToken(token),
                TokenValidTo = token.ValidTo
            };

            return authResultDto;
        }

        // POST: api/Account/SignUp
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("[action]")]
        public async Task<ActionResult<UserDto>> SignUp([FromBody] SignUpDto signUpDto)
        {
            var user = await _context.Users.Where(user => user.Email == signUpDto.Email)
                .FirstOrDefaultAsync();

            if (user is not null)
            {
                return Challenge();
            }
            
            var salt = GenerateSalt(64);

            var userToAdd = _mapper.Map<SignUpDto, User>(signUpDto);
            userToAdd.PasswordHash = GenerateArgon2Hash(userToAdd.PasswordHash, salt);
            userToAdd.Salt = salt;

            _context.Users.Add(userToAdd);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Login", _mapper.Map<User, UserDto>(userToAdd));
        }

        // GET: api/Account/Logout
        [HttpGet("[action]")]
        public async Task<IActionResult> Logout()
        {
            return Ok();
        }

        private JwtSecurityToken GenerateToken(Guid userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var credentials =
                new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256);
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new(ClaimTypes.NameIdentifier, userId.ToString()),
                }),
                Expires = DateTime.UtcNow.AddMinutes(AuthOptions.Lifetime),
                Issuer = AuthOptions.Issuer,
                Audience = AuthOptions.Audience,
                SigningCredentials = credentials
            };

            return tokenHandler.CreateJwtSecurityToken(tokenDescriptor);
        }
        
        private string GenerateSalt(int length)
        {
            var bytes = new byte[length];
            var random = new RNGCryptoServiceProvider();
            random.GetNonZeroBytes(bytes);
            
            return Convert.ToBase64String(bytes);
        }

        private Argon2Config GenerateArgon2Config(string password, string salt)
        {
            var passwordBytes = Encoding.UTF8.GetBytes(password);
            var saltBytes = Convert.FromBase64String(salt);
            
            return new Argon2Config()
            {
                Lanes = 4,
                MemoryCost = 2048,
                Type = Argon2Type.DataIndependentAddressing,
                HashLength = 128,
                TimeCost = 20,
                Password = passwordBytes,
                Salt = saltBytes
            };
        }
        
        private string GenerateArgon2Hash(string password, string salt)
        {
            var argon2Config = GenerateArgon2Config(password, salt);

            return Argon2.Hash(argon2Config);
        }
    }
}
