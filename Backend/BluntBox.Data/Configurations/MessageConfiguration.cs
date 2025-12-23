using BluntBox.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BluntBox.Data.Configurations
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.HasKey(m => m.Id);
            builder.Property(m => m.Content).IsRequired().HasMaxLength(2000);
            builder.Property(m => m.Language).IsRequired().HasMaxLength(10).HasDefaultValue("en");
            builder.Property(m => m.SentAt).IsRequired();
            builder.HasMany(m => m.Replies).WithOne().HasForeignKey(r => r.MessageId).OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(m => m.Attachments).WithOne().HasForeignKey(a => a.MessageId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
