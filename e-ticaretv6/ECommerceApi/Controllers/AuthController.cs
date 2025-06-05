using ECommerceApi.Data;
using ECommerceApi.DTOs;
using ECommerceApi.Helpers;
using ECommerceApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace ECommerceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _config;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest("Bu e-posta zaten kayıtlı.");

            var user = new User
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                Role = dto.Role
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, user.Role);

            var token = JwtTokenGenerator.GenerateToken(user, _config);
            return Ok(new
            {
                token,
                fullName = user.FullName,
                email = user.Email,
                role = user.Role,
                id = user.Id
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized("Kullanıcı bulunamadı.");

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded)
                return Unauthorized("Şifre hatalı.");

            var token = JwtTokenGenerator.GenerateToken(user, _config);
            return Ok(new
            {
                token,
                fullName = user.FullName,
                email = user.Email,
                role = user.Role,
                id = user.Id
            });
        }

        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var userId = User.FindFirst("id")?.Value;
            if (userId == null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound();

            user.FullName = dto.FullName;
            user.PhoneNumber = dto.Phone;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest("Profil güncellenemedi.");

            return Ok("Profil güncellendi.");
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var userId = User.FindFirst("id")?.Value;
            if (userId == null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("Kullanıcı bulunamadı.");

            var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok("Şifre başarıyla değiştirildi.");
        }
    }
}
