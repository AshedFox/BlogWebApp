using BlogWebApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogWebApp.Data
{
    public class PostgresDbContext:DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<PostMark> PostsMarks { get; set; }
        public DbSet<CommentMark> CommentsMarks { get; set; }

        public PostgresDbContext(DbContextOptions<PostgresDbContext> options) 
            :base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasPostgresExtension("uuid-ossp");

            modelBuilder.Entity<User>().Property(user => user.Id).HasDefaultValueSql("uuid_generate_v4()");
            modelBuilder.Entity<User>().Property(user => user.CreatedAt).ValueGeneratedOnAdd().HasDefaultValueSql("now()");
            modelBuilder.Entity<User>().HasIndex(user => user.Email).IsUnique();

            modelBuilder.Entity<Post>().Property(post => post.Id).HasDefaultValueSql("uuid_generate_v4()");
            modelBuilder.Entity<Post>().Property(post => post.CreatedAt)
                .ValueGeneratedOnAdd().HasDefaultValueSql("now()");
            modelBuilder.Entity<Post>()
                .HasOne(post => post.Creator)
                .WithMany(user => user.CreatedPosts);
            modelBuilder.Entity<Post>()
                .HasMany(post => post.Comments)
                .WithOne(comment => comment.Post);
            
            modelBuilder.Entity<Comment>()
                .HasOne(comment => comment.Creator)
                .WithMany(user => user.CreatedComments);
            modelBuilder.Entity<Comment>().Property(comment => comment.CreatedAt).ValueGeneratedOnAdd()
                .HasDefaultValueSql("now()");
            
            modelBuilder.Entity<File>().Property(file => file.Id).HasDefaultValueSql("uuid_generate_v4()");
            
            modelBuilder.Entity<PostMark>().Property(mark => mark.Id).HasDefaultValueSql("uuid_generate_v4()");
            modelBuilder.Entity<PostMark>()
                .HasOne(m => m.User)
                .WithMany(u => u.PostsMarks)
                .HasForeignKey(m => m.UserId);
            modelBuilder.Entity<PostMark>()
                .HasOne(m => m.Post)
                .WithMany(p => p.Marks)
                .HasForeignKey(m => m.PostId);
            modelBuilder.Entity<PostMark>().HasAlternateKey(m => new { m.PostId, m.UserId });

            modelBuilder.Entity<CommentMark>().Property(mark => mark.Id).HasDefaultValueSql("uuid_generate_v4()");
            modelBuilder.Entity<CommentMark>()
                .HasOne(m => m.User)
                .WithMany(u => u.CommentsMarks)
                .HasForeignKey(m => m.UserId);
            modelBuilder.Entity<CommentMark>()
                .HasOne(m => m.Comment)
                .WithMany(p => p.Marks)
                .HasForeignKey(m => m.CommentId);
            modelBuilder.Entity<CommentMark>().HasAlternateKey(m => new { m.CommentId, m.UserId });
        }
    }
}