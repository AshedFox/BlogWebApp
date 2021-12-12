using BlogWebApp.Models;
using Microsoft.EntityFrameworkCore;
using BlogWebApp.DTOs;

namespace BlogWebApp.Data
{
    public class PostgresDbContext:DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<File> Files { get; set; }
        public PostgresDbContext(DbContextOptions<PostgresDbContext> options) 
            :base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasPostgresExtension("uuid-ossp");

            modelBuilder.Entity<User>().Property(user => user.Id).HasDefaultValueSql("uuid_generate_v4()");
            modelBuilder.Entity<User>().Property(user => user.CreatedAt).ValueGeneratedOnAdd()
                .HasDefaultValueSql("now()");
            modelBuilder.Entity<User>().HasIndex(user => user.Email).IsUnique();
            modelBuilder.Entity<Post>().Property(post => post.Id).HasDefaultValueSql("uuid_generate_v4()");
            modelBuilder.Entity<Post>().Property(post => post.CreatedAt).ValueGeneratedOnAdd()
                .HasDefaultValueSql("now()");
            modelBuilder.Entity<Post>().HasOne(post => post.Creator)
                .WithMany(user => user.CreatedPosts);
            modelBuilder.Entity<Comment>().HasOne(comment => comment.Creator)
                .WithMany(user => user.CreatedComments);
            modelBuilder.Entity<Comment>().Property(comment => comment.CreatedAt).ValueGeneratedOnAdd()
                .HasDefaultValueSql("now()");
            modelBuilder.Entity<Comment>().ToTable("Comments");
            modelBuilder.Entity<File>().Property(file => file.Id).HasDefaultValueSql("uuid_generate_v4()");

            modelBuilder
                .Entity<Post>()
                .HasMany(post => post.UsersMarked)
                .WithMany(user => user.MarkedPosts)
                .UsingEntity<PostMark>(
                    mark => mark
                        .HasOne(m => m.User)
                        .WithMany(u => u.PostsMarks)
                        .HasForeignKey(m => m.UserId),
                    mark => mark
                        .HasOne(m => m.Post)
                        .WithMany(p => p.Marks)
                        .HasForeignKey(m => m.PostId),
                    mark =>
                    {
                        mark.Property(m => m.Value);
                        mark.HasKey(m => new { m.PostId, m.UserId });
                        mark.ToTable("PostsMarks");
                    });

            modelBuilder
                .Entity<Post>()
                .HasMany(post => post.Comments)
                .WithOne(comment => comment.Post);

            modelBuilder
                .Entity<Comment>()
                .HasMany(comment => comment.UsersMarked)
                .WithMany(user => user.MarkedComments)
                .UsingEntity<CommentMark>(
                    mark => mark
                        .HasOne(m => m.User)
                        .WithMany(u => u.CommentsMarks)
                        .HasForeignKey(m => m.UserId),
                    mark => mark
                        .HasOne(m => m.Comment)
                        .WithMany(p => p.Marks)
                        .HasForeignKey(m => m.CommentId),
                    mark =>
                    {
                        mark.Property(m => m.Value);
                        mark.HasKey(m => new { m.CommentId, m.UserId });
                        mark.ToTable("CommentsMarks");
                    });
        }
    }
}