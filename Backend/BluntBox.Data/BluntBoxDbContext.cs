using BluntBox.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace BluntBox.Data
{
    public class BluntBoxDbContext : DbContext
    {
        public BluntBoxDbContext(DbContextOptions<BluntBoxDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Reply> Replies { get; set; }
        public DbSet<MessageAttachment> MessageAttachments { get; set; }
        public DbSet<BluntBox.Core.Entities.Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new Configurations.MessageConfiguration());

            modelBuilder.Entity<User>(b =>
            {
                b.HasKey(u => u.Id);
                b.Property(u => u.UserName).IsRequired().HasMaxLength(100);
                b.Property(u => u.Email).IsRequired().HasMaxLength(200);
                b.HasIndex(u => u.UserName).IsUnique();
                b.HasIndex(u => u.LinkSlug).IsUnique().HasFilter("[LinkSlug] IS NOT NULL");
            });

            modelBuilder.Entity<BluntBox.Core.Entities.Notification>(b =>
            {
                b.HasKey(n => n.Id);
                b.Property(n => n.Type).IsRequired().HasMaxLength(200);
                b.Property(n => n.Title).IsRequired().HasMaxLength(250);
                b.Property(n => n.Body).IsRequired().HasMaxLength(2000);
                b.Property(n => n.IsRead).HasDefaultValue(false);
                b.Property(n => n.CreatedAt).IsRequired();
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
