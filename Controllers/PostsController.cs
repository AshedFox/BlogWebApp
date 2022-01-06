using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using BlogWebApp.Data;
using BlogWebApp.DTOs;
using BlogWebApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;

namespace BlogWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly PostgresDbContext _context;
        private readonly IMapper _mapper;

        public PostsController(PostgresDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Posts
        [HttpGet]
        public async Task<ActionResult<GetPostsResultDto>> GetPosts(int offset, int limit, 
            string title, DateTime? startDateTime, DateTime? endDateTime)
        {
            var posts = await _context.Posts
                .Include(post => post.Creator).ThenInclude(creator => creator.Avatar)
                .Include(post => post.Cover)
                .Include(post => post.Marks)
                .OrderByDescending(post => post.CreatedAt).ToListAsync();

            if (title is not null)
            {
                posts = posts.Where(post => post.Title.Contains(title, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            if (startDateTime is not null)
            {
                posts = posts.Where(post => post.CreatedAt >= startDateTime).ToList();
            }

            if (endDateTime is not null)
            {
                posts = posts.Where(post => post.CreatedAt <= endDateTime).ToList();
            }

            var postsList = posts.ToList();
            var maxPage = (int)Math.Ceiling((double)postsList.Count / limit);
            var postsDto = _mapper.Map<List<PostDto>>(postsList.Skip(offset).Take(limit).ToList());

            return new GetPostsResultDto()
            {
                Posts = postsDto,
                MaxPage = maxPage
            };
        }

        [HttpGet("[action]/{userId}")]
        public async Task<ActionResult<IEnumerable<PostDto>>> GetUserPosts(Guid userId)
        {
            var posts = await _context.Posts
                .Include(post => post.Creator).ThenInclude(creator => creator.Avatar)
                .Include(post => post.Cover)
                .Include(post => post.Marks)
                .Where(post => post.CreatorId == userId)
                .OrderByDescending(post => post.CreatedAt).ToListAsync();

            return _mapper.Map<List<PostDto>>(posts);
        }

        // GET: api/Posts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PostDto>> GetPost(Guid id)
        {
            var post = await _context.Posts
                .Include(post => post.Creator).ThenInclude(creator => creator.Avatar)
                .Include(post => post.Cover)
                .Include(post => post.Marks)
                .FirstOrDefaultAsync(post => post.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return _mapper.Map<PostDto>(post);
        }

        // POST: api/Posts
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PostDto>> PostPost(PostToAddDto postToAdd)
        {
            var post = _mapper.Map<PostToAddDto, Post>(postToAdd);
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPost", new { id = post.Id }, _mapper.Map<PostDto>(post));
        }
        
        // PUT: api/Posts/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutPost(Guid id, PostToEditDto postToEdit)
        {
            if (id != postToEdit.Id)
            {
                return BadRequest();
            }
            
            var post = await _context.Posts.FindAsync(id);
            if (post is null)
            {
                return NotFound();
            }

            if (User.FindFirstValue(JwtRegisteredClaimNames.Sub) != post.CreatorId.ToString())
            {
                return Unauthorized();
            }
            
            post.Content = postToEdit.Content;
            post.Title = postToEdit.Title;
            
            _context.Entry(post).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Posts/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post is null)
            {
                return NotFound();
            }

            if (User.FindFirstValue(JwtRegisteredClaimNames.Sub) != post.CreatorId.ToString())
            {
                return Unauthorized();
            }
            
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
