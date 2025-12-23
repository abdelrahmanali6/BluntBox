using System;
using System.Threading.Tasks;
using BluntBox.Core.Models;

namespace BluntBox.Core.Interfaces
{
    public interface IUserService
    {
        Task<UserPublicInfo> GetByUsernameAsync(string username);
        Task<UserPublicInfo> GetBySlugAsync(string slug);
    }
}
