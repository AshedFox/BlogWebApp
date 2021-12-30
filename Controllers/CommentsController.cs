using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogWebApp.Data;
using BlogWebApp.DTOs;
using BlogWebApp.Models;
using Microsoft.AspNetCore.Authorization;

namespace BlogWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly PostgresDbContext _context;
        private readonly IMapper _mapper;

        public CommentsController(PostgresDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Comments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(Guid? postId)
        {
            var comments = _context.Comments
                .Include(comment => comment.Creator)
                .Include(comment => comment.Post)
                .Include(comment => comment.ParentComment)
                .Include(comment => comment.Marks)
                .OrderBy(comment => comment.CreatedAt).AsQueryable();

            if (postId is not null)
            {
                comments = comments.Where(comment => comment.PostId == postId);
            }

            return _mapper.Map<List<CommentDto>>(await comments.ToListAsync());
        }

        // GET: api/Comments/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CommentDto>> GetComment(Guid id)
        {
            var comment = await _context.Comments
                .Include(comment => comment.Creator)
                .Include(comment => comment.Post)
                .Include(comment => comment.ParentComment)
                .Include(comment => comment.Marks)
                .FirstOrDefaultAsync(comment => comment.Id == id);

            if (comment == null)
            {
                return NotFound();
            }

            return _mapper.Map<CommentDto>(comment);
        }

        // POST: api/Comments
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Comment>> PostComment(CommentToAddDto commentToAdd)
        {
            var comment = _mapper.Map<Comment>(commentToAdd);
            
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetComment", new { id = comment.Id }, _mapper.Map<Comment, CommentDto>(comment));
        }
        
        // PUT: api/Comments/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutComment(Guid id, CommentToEditDto commentToEdit)
        {
            if (id != commentToEdit.Id)
            {
                return BadRequest();
            }

            var comment = await _context.Comments.FindAsync(id);
            if (comment is null)
            {
                return NotFound();
            }
            
            if (User.FindFirstValue(JwtRegisteredClaimNames.Sub) != comment.CreatorId.ToString())
            {
                return Unauthorized();
            }
            
            comment.Content = commentToEdit.Content;
            
            _context.Entry(comment).State = EntityState.Modified;
            
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Comments/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(Guid id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment is null)
            {
                return NotFound();
            }

            if (User.FindFirstValue(JwtRegisteredClaimNames.Sub) != comment.CreatorId.ToString())
            {
                return Unauthorized();
            }
            
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
