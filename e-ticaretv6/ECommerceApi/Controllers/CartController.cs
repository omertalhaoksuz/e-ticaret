using ECommerceApi.Data;
using ECommerceApi.Dtos;
using ECommerceApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ECommerceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // sadece giriş yapmış kullanıcılar
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Sepete ürün ekle
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            // Aynı ürün + renk varsa miktarı artır
            var existing = await _context.CartItems
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.ProductId == dto.ProductId &&
                    x.ColorOptionId == dto.ColorOptionId &&
                    x.Description == dto.Description);

            if (existing != null)
            {
                existing.Quantity += dto.Quantity;
            }
            else
            {
                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = dto.ProductId,
                    ColorOptionId = dto.ColorOptionId,
                    Description = dto.Description,
                    Quantity = dto.Quantity
                };

                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok("Ürün sepete eklendi");
        }


        // ✅ Sepeti listele
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItem>>> GetMyCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var items = await _context.CartItems
                .Include(x => x.Product)
                .Include(x => x.ColorOption)
                .Where(x => x.UserId == userId)
                .ToListAsync();

            return Ok(items);
        }

        // ✅ Sepetten ürün sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var item = await _context.CartItems.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (item == null) return NotFound();

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
