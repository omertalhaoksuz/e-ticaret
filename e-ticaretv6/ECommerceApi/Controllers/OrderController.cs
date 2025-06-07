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
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var cartItems = await _context.CartItems
                .Include(c => c.Product)
                .Include(c => c.ColorOption)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
                return BadRequest("Sepetiniz boş.");

            Address? billingAddress = null;
            if (dto.BillingAddressId.HasValue)
            {
                billingAddress = await _context.Addresses
                    .FirstOrDefaultAsync(a => a.Id == dto.BillingAddressId && a.UserId == userId);

                if (billingAddress == null)
                    return BadRequest("Geçerli bir fatura adresi bulunamadı.");
            }

            var order = new Order
            {
                UserId = userId,
                BillingAddressId = billingAddress?.Id,
                Items = cartItems.Select(item => new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Description = item.Description,
                    ColorName = item.ColorOption?.Name ?? "",
                    ColorHex = item.ColorOption?.Hex ?? "#000000"
                }).ToList()
            };

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            var products = await _context.Products
                .Where(p => order.Items.Select(i => i.ProductId).Contains(p.Id))
                .ToDictionaryAsync(p => p.Id);

            var createdOrderDto = new CreatedOrderDto
            {
                OrderId = order.Id,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductName = products[i.ProductId].Name,
                    ImageUrl = products[i.ProductId].ImageUrl,
                    ColorName = i.ColorName,
                    ColorHex = i.ColorHex,
                    Description = i.Description,
                    Quantity = i.Quantity,
                    Price = products[i.ProductId].Price
                }).ToList()
            };

            return Ok(createdOrderDto);
        }

        [HttpGet("my-orders")]
        public async Task<ActionResult<IEnumerable<OrderDetailDto>>> GetMyOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .Include(o => o.BillingAddress)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var result = orders.Select(order => new OrderDetailDto
            {
                OrderId = order.Id,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductName = i.Product.Name,
                    ImageUrl = i.Product.ImageUrl,
                    ColorName = i.ColorName,
                    ColorHex = i.ColorHex,
                    Description = i.Description,
                    Quantity = i.Quantity,
                    Price = i.Product.Price
                }).ToList(),
                BillingFullName = order.BillingAddress?.FullName,
                BillingPhone = order.BillingAddress?.Phone,
                BillingCity = order.BillingAddress?.City,
                BillingDistrict = order.BillingAddress?.District,
                BillingFullAddress = order.BillingAddress?.FullAddress
            }).ToList();

            return Ok(result);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<AdminOrderDto>>> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .Include(o => o.BillingAddress)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var result = orders.Select(order => new AdminOrderDto
            {
                OrderId = order.Id,
                UserEmail = order.User.Email,
                UserFullName = order.User.FullName,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductName = i.Product.Name,
                    ImageUrl = i.Product.ImageUrl,
                    ColorName = i.ColorName,
                    ColorHex = i.ColorHex,
                    Description = i.Description,
                    Quantity = i.Quantity,
                    Price = i.Product.Price
                }).ToList(),
                BillingFullName = order.BillingAddress?.FullName,
                BillingPhone = order.BillingAddress?.Phone,
                BillingCity = order.BillingAddress?.City,
                BillingDistrict = order.BillingAddress?.District,
                BillingFullAddress = order.BillingAddress?.FullAddress
            }).ToList();

            return Ok(result);
        }
    }
}
