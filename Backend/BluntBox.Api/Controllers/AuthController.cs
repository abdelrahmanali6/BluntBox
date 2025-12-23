using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using BluntBox.Application.Interfaces;
using BluntBox.Application.Models;
using BluntBox.Core.Entities;
using BluntBox.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BluntBox.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly BluntBoxDbContext _db;
        private readonly IJwtTokenService _jwt;

        public AuthController(BluntBoxDbContext db, IJwtTokenService jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            var exists = await _db.Users.AnyAsync(u => u.Email == req.Email);
            if (exists) return BadRequest(new { error = "Email already registered" });

            var user = new User
            {
                Id = Guid.NewGuid(),
                UserName = req.UserName,
                Email = req.Email,
                DisplayName = req.DisplayName,
                CreatedAt = DateTime.UtcNow,
                PasswordHash = HashPassword(req.Password)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _jwt.CreateToken(user.Id, user.Email, user.UserName);
            return Ok(new AuthResponse { Token = token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == req.Email);
            if (user == null) return Unauthorized();

            if (user.PasswordHash != HashPassword(req.Password)) return Unauthorized();

            var token = _jwt.CreateToken(user.Id, user.Email, user.UserName);
            return Ok(new AuthResponse { Token = token });
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest req)
        {
            var sub = User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(sub, out var userId))
                return Unauthorized();

            var user = await _db.Users.SingleOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                return NotFound(new { error = "User not found" });

            // Verify current password
            var currentPasswordHash = HashPassword(req.CurrentPassword);
            if (user.PasswordHash != currentPasswordHash)
                return BadRequest(new { error = "Current password is incorrect" });

            // Update to new password
            user.PasswordHash = HashPassword(req.NewPassword);
            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Password changed successfully" });
        }

        private static string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
