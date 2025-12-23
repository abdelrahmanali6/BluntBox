using System;

namespace BluntBox.Application.Models
{
    public class UserPublicDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string? DisplayName { get; set; }
        public bool IsPrivateAccount { get; set; }
        public string? LinkSlug { get; set; }
    }
}
