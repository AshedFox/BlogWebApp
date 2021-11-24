using BlogWebApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogWebApp.Data
{
    public class PostgresDbContext:DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
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
            modelBuilder.Entity<File>().Property(file => file.Id).HasDefaultValueSql("uuid_generate_v4()");

        }
    }
}