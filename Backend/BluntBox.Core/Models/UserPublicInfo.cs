using System;

namespace BluntBox.Core.Models
{
    public class UserPublicInfo
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string? DisplayName { get; set; }
        public bool IsPrivateAccount { get; set; }
        public string? LinkSlug { get; set; }
    }
}
