using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
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

namespace BlogWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarksController: ControllerBase
    {
        private readonly PostgresDbContext _context;
        private readonly IMapper _mapper;

        public MarksController(PostgresDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        
        // GET: api/Marks/GetPostMarks/{postId}
        [HttpGet("[action]/{postId}")]
        public async Task<ActionResult<IEnumerable<PostMarkDto>>> GetPostMarks(Guid postId)
        {
            var marks = await _context.PostsMarks.Where(mark => mark.PostId == postId).ToListAsync();
            
            return Ok(_mapper.Map<List<PostMarkDto>>(marks));
        }
        
        // GET: api/Marks/GetUserPostsMarks/{userId}
        [HttpGet("[action]/{userId}")]
        public async Task<ActionResult<IEnumerable<PostMarkDto>>> GetUserPostsMarks(Guid userId)
        {
            var marks = await _context.PostsMarks.Where(mark => mark.UserId == userId).ToListAsync();
            
            return Ok(_mapper.Map<List<PostMarkDto>>(marks));
        }
        
        // GET: api/Marks/GetCommentMarks/{commentId}
        [HttpGet("[action]/{commentId}")]
        public async Task<ActionResult<IEnumerable<CommentMarkDto>>> GetCommentMarks(Guid commentId)
        {
            var marks = await _context.CommentsMarks.Where(mark => mark.CommentId == commentId).ToListAsync();
            
            return Ok(_mapper.Map<List<CommentMarkDto>>(marks));
        }
        
        // GET: api/Marks/GetUserCommentsMarks/{userId}
        [HttpGet("[action]/{userId}")]
        public async Task<ActionResult<IEnumerable<CommentMarkDto>>> GetUserCommentsMarks(Guid userId)
        {
            var marks = await _context.CommentsMarks.Where(mark => mark.UserId == userId).ToListAsync();
            
            return Ok(_mapper.Map<List<CommentMarkDto>>(marks));
        }
        
        // GET: api/Marks/GetPostMark/{id}
        [HttpGet("[action]/{id}")]
        public async Task<ActionResult<PostMarkDto>> GetPostMark(Guid id)
        {
            var mark = await _context.PostsMarks.FindAsync(id);
            
            if (mark is null)
            {
                return NotFound();
            }
            
            return Ok(_mapper.Map<PostMarkDto>(mark));
        }
        
        // GET: api/Marks/GetCommentMark/{id}
        [HttpGet("[action]/{id}")]
        public async Task<ActionResult<CommentMarkDto>> GetCommentMark(Guid id)
        {
            var mark = await _context.CommentsMarks.FindAsync(id);

            if (mark is null)
            {
                return NotFound();
            }
            
            return Ok(_mapper.Map<CommentMarkDto>(mark));
        }

        // POST: api/Marks/MarkPost
        [Authorize]
        [HttpPost("[action]")]
        public async Task<ActionResult<PostMark>> MarkPost([FromBody] PostMarkToAddDto postMarkToAdd)
        {
            if (await _context.Posts.FindAsync(postMarkToAdd.PostId) is null)
            {
                return NotFound();
            }
            
            if (await _context.Users.FindAsync(postMarkToAdd.UserId) is null)
            {
                return NotFound();
            }

            var existingMark = await _context.PostsMarks.FirstOrDefaultAsync(mark => 
                mark.UserId.Equals(postMarkToAdd.UserId) && mark.PostId.Equals(postMarkToAdd.PostId));

            if (existingMark is not null)
            {
                return Conflict();
            }

            var postMark = _mapper.Map<PostMark>(postMarkToAdd);
            
            _context.PostsMarks.Add(postMark);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPostMark", new { id = postMark.Id }, _mapper.Map<PostMarkDto>(postMark));
        }
        
        // POST: api/Marks/MarkComment
        [Authorize]
        [HttpPost("[action]")]
        public async Task<ActionResult<PostMark>> MarkComment([FromBody] CommentMarkToAddDto commentMarkToAdd)
        {
            if (await _context.Comments.FindAsync(commentMarkToAdd.CommentId) is null)
            {
                return NotFound();
            }
            
            if (await _context.Users.FindAsync(commentMarkToAdd.UserId) is null)
            {
                return NotFound();
            }

            var existingMark = await _context.CommentsMarks.FirstOrDefaultAsync(mark =>
                mark.UserId.Equals(commentMarkToAdd.UserId) && mark.CommentId.Equals(commentMarkToAdd.CommentId));

            if (existingMark is not null)
            {
                return Conflict();
            }

            var commentMark = _mapper.Map<CommentMark>(commentMarkToAdd);
            
            _context.CommentsMarks.Add(commentMark);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction("GetCommentMark", new { id = commentMark.Id }, _mapper.Map<CommentMarkDto>(commentMark));
        }
        
        // PUT: api/Marks/ChangePostMark/{id}
        [Authorize]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> ChangePostMark(Guid id, PostMarkToEditDto postMarkToEdit)
        {
            if (id != postMarkToEdit.Id)
            {
                return BadRequest();
            }

            var postMark = await _context.PostsMarks.FindAsync(id);

            if (User.FindFirstValue(JwtRegisteredClaimNames.Sub) != postMark.UserId.ToString())
            {
                return Unauthorized();
            }
            
            postMark.Value = postMarkToEdit.Value;
            
            _context.Entry(postMark).State = EntityState.Modified;
            
            await _context.SaveChangesAsync();

            return NoContent();
        }
             
        // PUT: api/Marks/ChangeCommentMark/{id}
        [Authorize]
        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> ChangeCommentMark(Guid id, CommentMarkToEditDto commentMarkToEdit)
        {
            if (id != commentMarkToEdit.Id)
            {
                return BadRequest();
            }

            var commentMark = await _context.CommentsMarks.FindAsync(id);

            if (User.FindFirstValue(JwtRegisteredClaimNames.Sub) != commentMark.UserId.ToString())
            {
                return Unauthorized();
            }
            
            commentMark.Value = commentMarkToEdit.Value;
            
            _context.Entry(commentMark).State = EntityState.Modified;
            
            await _context.SaveChangesAsync();

            return NoContent();
        }
                
        // DELETE: api/Marks/UnmarkPost/{id}
        [Authorize]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> UnmarkPost(Guid id)
        {
            var existingMark = await _context.PostsMarks.FindAsync(id);

            if (existingMark is null)
            {
                return NotFound();
            }

            if (User.FindFirstValue(JwtRegisteredClaimNames.Sub) != existingMark.UserId.ToString())
            {
                return Unauthorized();
            }
            
            _context.PostsMarks.Remove(existingMark);
            await _context.SaveChangesAsync();

            return NoContent();
        }
                
        // DELETE: api/Marks/UnmarkComment/{id}
        [Authorize]
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> UnmarkComment(Guid id)
        {
            var existingMark = await _context.CommentsMarks.FindAsync(id);

            if (existingMark is null)
            {
                return NotFound();
            }

            if (User.FindFirstValue(JwtRegisteredClaimNames.Sub) != existingMark.UserId.ToString())
            {
                return Unauthorized();
            }
            
            _context.CommentsMarks.Remove(existingMark);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}