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
            //user
            CreateMap<User, UserDto>();
            CreateMap<User, ShortUserDto>();
            CreateMap<SignUpDto, User>();
            CreateMap<UserToEditDto, User>();
            //post
            CreateMap<Post, PostDto>();
            CreateMap<PostToAddDto, Post>();
            CreateMap<PostToEditDto, Post>();
            //comment
            CreateMap<Comment, CommentDto>();
            CreateMap<CommentToAddDto, Comment>();
            CreateMap<CommentToEditDto, Comment>();
            //file
            CreateMap<File, FileDto>();
            //post mark
            CreateMap<PostMark, PostMarkDto>();
            CreateMap<PostMarkToAddDto, PostMark>();
            CreateMap<PostMarkToEditDto, PostMark>();
            //comment mark
            CreateMap<CommentMark, CommentMarkDto>();
            CreateMap<CommentMarkToAddDto, CommentMark>();
            CreateMap<CommentMarkToEditDto, CommentMark>();
        }
    }
}