using System;
using System.Collections.Generic;
using System.Linq;
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
        public async Task<ActionResult<TokensDto>> Login([FromBody] LoginDto loginDto)
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

            var refreshToken = TokensGenerator.GenerateRefreshToken();

            _context.RefreshTokens.Add(new RefreshToken()
            {
                Id = Guid.Parse(refreshToken),
                UserId = user.Id,
                ExpiredAt = DateTime.UtcNow.AddDays(AuthOptions.RefreshTokenLifetime)
            });
            await _context.SaveChangesAsync();

            var accessToken = TokensGenerator.GenerateAccessToken(user.Id.ToString());

            var tokensDto = new TokensDto()
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };

            return Ok(tokensDto);
        }

        // POST: api/Users/SignUp
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

            return CreatedAtAction("GetUser", new { id = userToAdd.Id }, _mapper.Map<User, UserDto>(userToAdd));
        }

        // POST: api/User/RefreshToken
        [HttpPost("[action]")]
        public async Task<ActionResult<TokensDto>> RefreshToken([FromBody] string refreshToken)
        {
            if (refreshToken is null)
            {
                return BadRequest();
            }

            var token = await _context.RefreshTokens.FindAsync(Guid.Parse(refreshToken));

            if (token is null)
            {
                return NotFound();
            }

            if (!token.IsActive)
            {
                return Unauthorized();
            }

            token.IsActive = false;
            _context.Entry(token).State = EntityState.Modified;
            
            if (token.ExpiredAt.CompareTo(DateTime.UtcNow) < 0)
            {
                await _context.SaveChangesAsync();

                return Unauthorized();
            }

            var newToken = TokensGenerator.GenerateRefreshToken();

            _context.RefreshTokens.Add(new RefreshToken()
            {
                Id = Guid.Parse(newToken),
                UserId = token.UserId,
                ExpiredAt = DateTime.UtcNow.AddDays(AuthOptions.RefreshTokenLifetime)
            });
            await _context.SaveChangesAsync();

            var accessToken = TokensGenerator.GenerateAccessToken(token.UserId.ToString());

            var tokensDto = new TokensDto()
            {
                AccessToken = accessToken,
                RefreshToken = newToken
            };

            return Ok(tokensDto);
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            return _mapper.Map<List<User>, List<UserDto>>(
                await _context.Users
                    .Include(user => user.CreatedPosts)
                    .Include(user => user.Avatar)
                    .ToListAsync()
            );
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(Guid id)
        {
            var user = await _context.Users
                .Include(user => user.CreatedPosts)
                .Include(user => user.Avatar)
                .FirstOrDefaultAsync(user1 => user1.Id == id);

            if (user is null)
            {
                return NotFound();
            }

            return _mapper.Map<User, UserDto>(user);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutUser(Guid id, [FromBody] User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user is null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.Id == id);
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
