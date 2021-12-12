using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using BlogWebApp.Data;
using BlogWebApp.DTOs;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using File = BlogWebApp.Models.File;

namespace BlogWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly PostgresDbContext _context;
        private readonly IMapper _mapper;
        private readonly Cloudinary _cloudinary;
        private readonly string _baseUploadPath = @"BlogWebApp/files/";
        
        public FilesController(PostgresDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            var account = new Account(
                "drtwnz3ni",
                "428946811592385",
                "8BTx7IzzPl99cDu3IDKnj06CIhw");

            _cloudinary = new Cloudinary(account);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FileDto>> GetFile(Guid id)
        {
            var file = await _context.Files.FirstOrDefaultAsync(file => file.Id == id);

            if (file == null)
            {
                return NotFound();
            }

            return _mapper.Map<File, FileDto>(file);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> PostFile(IFormFile file)
        {
            if (file is null || file.Length <= 0 || !file.ContentType.StartsWith("image"))
            {
                return BadRequest();
            }

            var uploadPath = Path.Combine(_baseUploadPath, Guid.NewGuid().ToString());
            var filename = Path.GetFileName(file.FileName);

            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(filename, stream),
                PublicId = uploadPath,
                Overwrite = true,
            };

            var result = await _cloudinary.UploadAsync(uploadParams);
            if (result.StatusCode != HttpStatusCode.OK)
            {
                return Problem();
            }
            
            var fileToAdd = new File()
            {
                Name = filename,
                Url = result.Url.ToString()
            };
            
            _context.Files.Add(fileToAdd);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFile", new { id = fileToAdd.Id }, _mapper.Map<File, FileDto>(fileToAdd));
        }
    }
}