using System;
using System.Collections.Generic;

namespace BluntBox.Core.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string? DisplayName { get; set; }
        public string? LinkSlug { get; set; }
        public bool IsPrivateAccount { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
