using System.Threading.Tasks;
using BluntBox.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BluntBox.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _users;

        public UsersController(IUserService users)
        {
            _users = users;
        }

        [HttpGet("by-username/{username}")]
        public async Task<IActionResult> GetByUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username)) return BadRequest();

            var user = await _users.GetByUsernameAsync(username);
            if (user == null) return NotFound();

            return Ok(user);
        }

        [HttpGet("by-slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug)) return BadRequest();

            var user = await _users.GetBySlugAsync(slug);
            if (user == null) return NotFound();

            return Ok(user);
        }
    }
}
