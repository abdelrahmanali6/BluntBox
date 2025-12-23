using System.Threading.Tasks;
using BluntBox.Core.Interfaces;
using BluntBox.Core.Models;
using BluntBox.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace BluntBox.Application.Services
{
    public class UserService : IUserService
    {
        private readonly BluntBoxDbContext _db;

        public UserService(BluntBoxDbContext db)
        {
            _db = db;
        }

        public async Task<UserPublicInfo> GetByUsernameAsync(string username)
        {
            if (string.IsNullOrWhiteSpace(username)) return null;

            var u = await _db.Users
                .Where(x => x.UserName == username)
                .Select(x => new UserPublicInfo
                {
                    Id = x.Id,
                    UserName = x.UserName,
                    DisplayName = x.DisplayName,
                    IsPrivateAccount = x.IsPrivateAccount,
                    LinkSlug = x.LinkSlug
                }).FirstOrDefaultAsync();

            return u;
        }

        public async Task<UserPublicInfo> GetBySlugAsync(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug)) return null;

            var u = await _db.Users
                .Where(x => x.LinkSlug == slug)
                .Select(x => new UserPublicInfo
                {
                    Id = x.Id,
                    UserName = x.UserName,
                    DisplayName = x.DisplayName,
                    IsPrivateAccount = x.IsPrivateAccount,
                    LinkSlug = x.LinkSlug
                }).FirstOrDefaultAsync();

            return u;
        }
    }
}
