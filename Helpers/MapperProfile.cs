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
            CreateMap<SignUpDto, User>();
            CreateMap<Post, PostDto>();
            CreateMap<PostToAddDto, Post>();
            CreateMap<PostToEditDto, Post>();
        }
    }
}