using ECommerceApi.Data;
using ECommerceApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECommerceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ColorController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ColorController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Herkes renkleri görebilir
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ColorOption>>> GetAll()
        {
            return await _context.ColorOptions.ToListAsync();
        }

        // ✅ Yeni renk ekle (sadece Admin)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(ColorOption color)
        {
            if (string.IsNullOrWhiteSpace(color.Name))
                return BadRequest("Renk adı boş olamaz.");

            _context.ColorOptions.Add(color);
            await _context.SaveChangesAsync();
            return Ok(color);
        }

        // ✅ Renk sil (sadece Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var color = await _context.ColorOptions.FindAsync(id);
            if (color == null)
                return NotFound();

            _context.ColorOptions.Remove(color);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
