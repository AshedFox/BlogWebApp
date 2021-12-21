using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BlogWebApp.Data;
using BlogWebApp.DTOs;
using BlogWebApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<GetPostsResultDto>> GetPosts(Guid? creatorId, int offset, int limit)
        {
            List<Post> posts;

            if (creatorId is not null)
            {
                posts = await _context.Posts
                    .Include(post => post.Creator).ThenInclude(creator => creator.Avatar)
                    .Include(post => post.Cover)
                    .Include(post => post.Marks)
                    .Include(post => post.UsersMarked)
                    .Where(post => post.Creator.Id == creatorId)
                    .OrderByDescending(post => post.CreatedAt)
                    .Skip(offset).Take(limit)
                    .ToListAsync();
            }
            else
            {
                posts = await _context.Posts
                    .Include(post => post.Creator).ThenInclude(creator => creator.Avatar)
                    .Include(post => post.Cover)
                    .Include(post => post.Marks)
                    .Include(post => post.UsersMarked)
                    .OrderByDescending(post => post.CreatedAt)
                    .Skip(offset).Take(limit).ToListAsync();
            }

            var postsDto = _mapper.Map<List<Post>, List<PostDto>>(posts);

            return new GetPostsResultDto()
            {
                Posts = postsDto,
                MaxPage = (int)Math.Ceiling((double)_context.Posts.Count() / limit)
            };
        }

        // GET: api/Posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostDto>> GetPost(Guid id)
        {
            var post = await _context.Posts
                .Include(post => post.Creator)
                .ThenInclude(creator => creator.Avatar)
                .Include(post => post.Cover)
                .Include(post => post.Marks)
                .Include(post => post.UsersMarked)
                .FirstOrDefaultAsync(post => post.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return _mapper.Map<Post, PostDto>(post);
        }

        // POST: api/Posts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PostDto>> PostPost(PostToAddDto postToAdd)
        {
            var post = _mapper.Map<PostToAddDto, Post>(postToAdd);
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPost", new { id = post.Id }, _mapper.Map<Post, PostDto>(post));
        }
        
        // PUT: api/Posts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutPost(Guid id, PostToEditDto postToEdit)
        {
            if (id != postToEdit.Id)
            {
                return BadRequest();
            }
            
            var post = _mapper.Map<PostToEditDto, Post>(postToEdit);
            
            _context.Entry(post).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostExists(id))
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

        // DELETE: api/Posts/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PostExists(Guid id)
        {
            return _context.Posts.Any(e => e.Id == id);
        }
    }
}
