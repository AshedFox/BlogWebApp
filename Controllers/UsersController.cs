using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using BlogWebApp.Auth;
using BlogWebApp.Data;
using BlogWebApp.DTOs;
using BlogWebApp.Models;
using Isopoh.Cryptography.Argon2;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlogWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly PostgresDbContext _context;
        private readonly IMapper _mapper;

        public UsersController(PostgresDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Users/Login
        [HttpPost("[action]")]
        public async Task<ActionResult<AccountDto>> Login([FromBody] LoginDto loginDto)
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
            
            var refreshToken = new RefreshToken()
            {
                Id = Guid.Parse(TokensGenerator.GenerateRefreshToken()),
                UserId = user.Id,
                ExpiredAt = DateTime.UtcNow.AddDays(AuthOptions.RefreshTokenLifetime)
            };
            
            _context.RefreshTokens.Add(refreshToken);
            _context.RefreshTokens.RemoveRange(_context.RefreshTokens.Where(rt => 
                rt.ExpiredAt.CompareTo(DateTime.UtcNow) < 0));

            await _context.SaveChangesAsync();

            var accessToken = TokensGenerator.GenerateAccessToken(user.Id.ToString());
            var accessTokenExpiredAt = DateTime.UtcNow.AddMinutes(AuthOptions.AccessTokenLifetime);

            Response.Cookies.Append("X-Access-Token", accessToken,
                new CookieOptions()
                {
                    HttpOnly = true, SameSite = SameSiteMode.Strict,
                    Expires = accessTokenExpiredAt
                });
            Response.Cookies.Append("X-Refresh-Token", refreshToken.Id.ToString(),
                new CookieOptions()
                {
                    HttpOnly = true, SameSite = SameSiteMode.Strict, 
                    Expires = refreshToken.ExpiredAt
                });
            
            return Ok(new AccountDto()
            {
                UserId = user.Id,
                AccessTokenExpiredAt = accessTokenExpiredAt,
                RefreshTokenExpiredAt = refreshToken.ExpiredAt
            });
        }

        // POST: api/Users/SignUp
        [HttpPost("[action]")]
        public async Task<ActionResult<UserDto>> SignUp([FromBody] SignUpDto signUpDto)
        {
            var user = await _context.Users.Where(user => user.Email == signUpDto.Email)
                .FirstOrDefaultAsync();

            if (user is not null)
            {
                return Conflict();
            }

            var salt = GenerateSalt(64);

            var userToAdd = _mapper.Map<User>(signUpDto);
            userToAdd.PasswordHash = GenerateArgon2Hash(userToAdd.PasswordHash, salt);
            userToAdd.Salt = salt;

            _context.Users.Add(userToAdd);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = userToAdd.Id }, _mapper.Map<UserDto>(userToAdd));
        }

        // POST: api/Users/Logout
        [HttpPost("[action]")]
        [Authorize]
        public async Task<ActionResult> Logout()
        {
            var refreshToken = Request.Cookies["X-Refresh-Token"];
            
            if (refreshToken is null)
            {
                return BadRequest();
            }

            var token = await _context.RefreshTokens.FindAsync(Guid.Parse(refreshToken));

            if (token is null)
            {
                return NotFound();
            }

            _context.Remove(token);
            await _context.SaveChangesAsync();

            Response.Cookies.Delete("X-Access-Token");
            Response.Cookies.Delete("X-Refresh-Token");
            
            return Ok();
        }

        // POST: api/Users/RefreshToken
        [HttpPost("[action]")]
        public async Task<ActionResult<string>> RefreshToken()
        {
            var refreshToken = Request.Cookies["X-Refresh-Token"];
            
            if (refreshToken is null)
            {
                return BadRequest();
            }

            var token = await _context.RefreshTokens.FindAsync(Guid.Parse(refreshToken));

            if (token is null)
            {
                return NotFound();
            }

            _context.Remove(token);
            
            if (token.ExpiredAt.CompareTo(DateTime.UtcNow) < 0)
            {
                await _context.SaveChangesAsync();

                return Unauthorized();
            }

            var newRefreshToken = new RefreshToken()
            {
                Id = Guid.Parse(TokensGenerator.GenerateRefreshToken()),
                UserId = token.UserId,
                ExpiredAt = DateTime.UtcNow.AddDays(AuthOptions.RefreshTokenLifetime)
            };
            _context.RefreshTokens.Add(newRefreshToken);

            await _context.SaveChangesAsync();

            var accessToken = TokensGenerator.GenerateAccessToken(token.UserId.ToString());
            var accessTokenExpiredAt = DateTime.UtcNow.AddMinutes(AuthOptions.AccessTokenLifetime);

            Response.Cookies.Append("X-Access-Token", accessToken,
                new CookieOptions()
                {
                    HttpOnly = true, SameSite = SameSiteMode.Strict,
                    Expires = accessTokenExpiredAt
                });
            Response.Cookies.Append("X-Refresh-Token", newRefreshToken.Id.ToString(),
                new CookieOptions()
                {
                    HttpOnly = true, SameSite = SameSiteMode.Strict, 
                    Expires = newRefreshToken.ExpiredAt
                });

            return Ok(new AccountDto()
            {
                UserId = newRefreshToken.UserId,
                AccessTokenExpiredAt = accessTokenExpiredAt,
                RefreshTokenExpiredAt = newRefreshToken.ExpiredAt
            });
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Include(user => user.CreatedPosts)
                .Include(user => user.PostsMarks)
                .Include(user => user.CreatedComments)
                .Include(user => user.CommentsMarks)
                .Include(user => user.Avatar)
                .ToListAsync();
            
            return _mapper.Map<List<UserDto>>(users);
        }

        // GET: api/Users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(Guid id)
        {
            var user = await _context.Users
                .Include(user => user.CreatedPosts)
                .Include(user => user.PostsMarks)
                .Include(user => user.CreatedComments)
                .Include(user => user.CommentsMarks)
                .Include(user => user.Avatar)
                .FirstOrDefaultAsync(user => user.Id == id);

            if (user is null)
            {
                return NotFound();
            }

            return _mapper.Map<UserDto>(user);
        }

        // PUT: api/Users/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutUser(Guid id, [FromBody] UserToEditDto userToEdit)
        {
            if (id != userToEdit.Id)
            {
                return BadRequest();
            }

            var user = await _context.Users.FindAsync(id);

            if (User.FindFirstValue(JwtRegisteredClaimNames.Sub) != user.Id.ToString())
            {
                return Unauthorized();
            }
            
            user.Name = userToEdit.Name;
            user.BornAt = userToEdit.BornAt;
            user.SelfInformation = userToEdit.SelfInformation;
            user.Gender = userToEdit.Gender;
            
            _context.Entry(user).State = EntityState.Modified;
            
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Users/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user is null)
            {
                return NotFound();
            }

            if (User.FindFirstValue(JwtRegisteredClaimNames.Sub) != user.Id.ToString())
            {
                return Unauthorized();
            }
            
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
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
