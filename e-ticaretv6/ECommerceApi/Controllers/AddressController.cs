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
    [Authorize]
    public class AddressController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AddressController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Adres ekle
        [HttpPost]
        public async Task<IActionResult> AddAddress([FromBody] AddressDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Eğer yeni adres fatura adresiyse, eski fatura adreslerini kaldır
            if (dto.IsBillingAddress)
            {
                var oldBillingAddresses = await _context.Addresses
                    .Where(a => a.UserId == userId && a.IsBillingAddress)
                    .ToListAsync();

                foreach (var old in oldBillingAddresses)
                    old.IsBillingAddress = false;
            }

            var address = new Address
            {
                UserId = userId,
                Title = dto.Title,
                FullName = dto.FullName,
                Phone = dto.Phone,
                City = dto.City,
                District = dto.District,
                FullAddress = dto.FullAddress,
                IsBillingAddress = dto.IsBillingAddress
            };

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return Ok(address);
        }


        // ✅ Kullanıcının adreslerini getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Address>>> GetMyAddresses()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var addresses = await _context.Addresses
                .Where(a => a.UserId == userId)
                .ToListAsync();

            return Ok(addresses);
        }

        // ✅ Adresi sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var address = await _context.Addresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (address == null)
                return NotFound();

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // ✅ Adres güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AddressDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var existing = await _context.Addresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (existing == null)
                return NotFound("Adres bulunamadı.");

            // Bu adres artık fatura adresi olacaksa, diğerlerini kaldır
            if (dto.IsBillingAddress && !existing.IsBillingAddress)
            {
                var oldBilling = await _context.Addresses
                    .Where(a => a.UserId == userId && a.IsBillingAddress)
                    .ToListAsync();

                foreach (var old in oldBilling)
                    old.IsBillingAddress = false;
            }

            existing.Title = dto.Title;
            existing.FullName = dto.FullName;
            existing.Phone = dto.Phone;
            existing.City = dto.City;
            existing.District = dto.District;
            existing.FullAddress = dto.FullAddress;
            existing.IsBillingAddress = dto.IsBillingAddress;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }



    }
}
