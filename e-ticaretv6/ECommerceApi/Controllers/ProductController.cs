using ECommerceApi.Data;
using ECommerceApi.Dtos;
using ECommerceApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ECommerceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: Tüm ürünleri listele
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.ProductColorOptions)
                        .ThenInclude(pco => pco.ColorOption)
                    .ToListAsync();

                var result = products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Description = p.Description,
                    Colors = p.ProductColorOptions
                                .Where(pco => pco.ColorOption != null)
                                .Select(pco => pco.ColorOption!.Name)
                                .ToList(),
                                ShowOnHome = p.ShowOnHome
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hata: {ex.Message}");
            }
        }

        // ✅ GET: Belirli bir ürünü getir + renk bilgisiyle
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.ProductColorOptions)
                    .ThenInclude(pco => pco.ColorOption)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();
            return product;
        }

        // ✅ POST: Yeni ürün ekle (JSON tabanlı) — gerekirse
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> Create(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        // ✅ PUT: Ürün güncelle + görsel değiştirme
        [HttpPut("update/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id,
            [FromForm] string name,
            [FromForm] decimal price,
            [FromForm] string? description,
            [FromForm] IFormFile? image)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound("Ürün bulunamadı.");

            product.Name = name;
            product.Price = price;
            product.Description = description;

            if (image != null && image.Length > 0)
            {
                // Eski resmi sil
                if (!string.IsNullOrEmpty(product.ImageUrl))
                {
                    var oldPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", product.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                // Yeni resmi kaydet
                var fileName = $"{Guid.NewGuid()}_{image.FileName}";
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads", fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await image.CopyToAsync(stream);

                product.ImageUrl = $"/uploads/{fileName}";
            }

            await _context.SaveChangesAsync();
            return Ok(product);
        }

        // ✅ DELETE: Ürün sil
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ UPLOAD: Görsel + renklerle ürün oluşturma
        [HttpPost("upload")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadProduct(
            [FromForm] string name,
            [FromForm] decimal price,
            [FromForm] string? description,
            [FromForm] IFormFile image,
            [FromForm] List<int> colorOptionIds)
        {
            if (image == null || image.Length == 0)
                return BadRequest("Resim seçilmedi.");

            var fileName = $"{Guid.NewGuid()}_{image.FileName}";
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads", fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await image.CopyToAsync(stream);

            var product = new Product
            {
                Name = name,
                Price = price,
                Description = description,
                ImageUrl = $"/uploads/{fileName}",
                ProductColorOptions = new List<ProductColorOption>()
            };

            foreach (var colorId in colorOptionIds)
            {
                var color = await _context.ColorOptions.FindAsync(colorId);
                if (color != null)
                {
                    product.ProductColorOptions.Add(new ProductColorOption
                    {
                        Product = product,
                        ColorOption = color
                    });
                }
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }
        [HttpPut("display-settings/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateDisplaySettings(int id, [FromBody] UpdateDisplaySettingsDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            product.ShowOnHome = dto.ShowOnHome;
            product.ShowOnButton1 = dto.ShowOnButton1;
            product.ShowOnButton2 = dto.ShowOnButton2;
            product.ShowOnButton3 = dto.ShowOnButton3;
            product.ShowOnButton4 = dto.ShowOnButton4;
            product.ShowOnButton5 = dto.ShowOnButton5;

            await _context.SaveChangesAsync();
            return Ok("Display settings updated.");
        }
        [HttpPut("{id}/featured")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateFeaturedStatus(int id, [FromBody] bool isFeatured)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound("Ürün bulunamadı.");

            product.ShowOnHome = isFeatured;
            await _context.SaveChangesAsync();

            return Ok("Featured durumu güncellendi.");
        }

    }
}
