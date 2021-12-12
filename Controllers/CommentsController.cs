using System;
using System.Collections.Generic;
using System.Linq;
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
            List<Comment> comments;

            if (postId is null)
            {
                comments = await _context.Comments
                    .Include(comment => comment.Creator)
                    .Include(comment => comment.Post)
                    .Include(comment => comment.ParentComment)
                    .Include(comment => comment.UsersMarked)
                    .Include(comment => comment.Marks)
                    .OrderBy(comment => comment.CreatedAt)
                    .ToListAsync();
            }
            else
            {
                comments = await _context.Comments
                    .Include(comment => comment.Creator)
                    .Include(comment => comment.Post)
                    .Include(comment => comment.ParentComment)
                    .Include(comment => comment.UsersMarked)
                    .Include(comment => comment.Marks)
                    .Where(comment => comment.PostId == postId)
                    .OrderBy(comment => comment.CreatedAt)
                    .ToListAsync();
            }

            return _mapper.Map<List<Comment>, List<CommentDto>>(comments);
        }

        // GET: api/Comments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CommentDto>> GetComment(Guid id)
        {
            var comment = await _context.Comments
                .Include(comment => comment.Creator)
                .Include(comment => comment.Post)
                .Include(comment => comment.ParentComment)
                .Include(comment => comment.UsersMarked)
                .Include(comment => comment.Marks)
                .FirstOrDefaultAsync(comment => comment.Id == id);

            if (comment == null)
            {
                return NotFound();
            }

            return _mapper.Map<Comment, CommentDto>(comment);
        }

        // PUT: api/Comments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutComment(Guid id, CommentToEditDto commentToEdit)
        {
            if (id != commentToEdit.Id)
            {
                return BadRequest();
            }

            var comment = _mapper.Map<CommentToEditDto, Comment>(commentToEdit);
            
            _context.Entry(comment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentExists(id))
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

        // POST: api/Comments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Comment>> PostComment(CommentToAddDto commentToAdd)
        {
            var comment = _mapper.Map<CommentToAddDto, Comment>(commentToAdd);
            
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetComment", new { id = comment.Id }, _mapper.Map<Comment, CommentDto>(comment));
        }

        // DELETE: api/Comments/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(Guid id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CommentExists(Guid id)
        {
            return _context.Comments.Any(e => e.Id == id);
        }
    }
}
