using System.Linq;
using AutoMapper;
using BlogWebApp.DTOs;
using BlogWebApp.Models;

namespace BlogWebApp.Helpers
{
    public class MapperProfile: Profile
    {
        public MapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<User, ShortUserDto>();
            CreateMap<SignUpDto, User>();
            CreateMap<Post, PostDto>()
                .ForMember(dto => dto.TotalMark, expression => 
                    expression.MapFrom(post => post.Marks.Sum(mark => mark.Value)))
                .ForMember(dto => dto.MarksCount, expression => 
                    expression.MapFrom(post => post.Marks.Count));
            CreateMap<PostToAddDto, Post>();
            CreateMap<PostToEditDto, Post>();
            CreateMap<Comment, CommentDto>()
                .ForMember(dto => dto.TotalMark, expression => 
                    expression.MapFrom(comment => comment.Marks.Sum(mark => mark.Value)))
                .ForMember(dto => dto.MarksCount, expression => 
                    expression.MapFrom(comment => comment.Marks.Count));
            CreateMap<CommentToAddDto, Comment>();
            CreateMap<CommentToEditDto, Comment>();
            CreateMap<File, FileDto>();
        }
    }
}