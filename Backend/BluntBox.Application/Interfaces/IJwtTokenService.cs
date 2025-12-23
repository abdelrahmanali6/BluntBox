using System;

namespace BluntBox.Application.Interfaces
{
    public interface IJwtTokenService
    {
        string CreateToken(Guid userId, string email, string userName);
    }
}
