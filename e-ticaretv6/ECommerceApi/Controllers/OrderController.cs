using ECommerceApi.Data;
using ECommerceApi.Dtos;
using ECommerceApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using ECommerceApi.Services;

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

            // ✅ Fatura adresi kontrolü
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
                    ColorOptionId = item.ColorOptionId,
                    Description = item.Description,
                    Quantity = item.Quantity
                }).ToList()
            };

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            // ✅ Ürünleri ve renkleri manuel olarak çekiyoruz çünkü EF bunları Order.Items altında getirmiyor
            var productIds = order.Items.Select(i => i.ProductId).ToList();
            var colorIds = order.Items.Select(i => i.ColorOptionId).ToList();

            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id);

            var colors = await _context.ColorOptions
                .Where(c => colorIds.Contains(c.Id))
                .ToDictionaryAsync(c => c.Id);

            var result = new CreatedOrderDto
            {
                OrderId = order.Id,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductName = products.ContainsKey(i.ProductId) ? products[i.ProductId].Name : "Bilinmiyor",
                    ImageUrl = products.ContainsKey(i.ProductId) ? products[i.ProductId].ImageUrl : "",
                    ColorName = i.ColorOptionId.HasValue && colors.ContainsKey(i.ColorOptionId.Value) ? colors[i.ColorOptionId.Value].Name : null,
                    Description = i.Description,
                    Quantity = i.Quantity,
                    Price = i.Product.Price
                }).ToList()
            };

            return Ok(result);
        }




        // ✅ Kullanıcının siparişleri
        [HttpGet("my-orders")]
        public async Task<ActionResult<IEnumerable<OrderDetailDto>>> GetMyOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .Include(o => o.Items).ThenInclude(i => i.ColorOption)
                .Include(o => o.BillingAddress) // ✅ Fatura adresini dahil et
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
                    ColorName = i.ColorOption?.Name,
                    Description = i.Description,
                    Quantity = i.Quantity,
                    Price = i.Product.Price
                }).ToList(),

                // ✅ Fatura adres bilgileri
                BillingFullName = order.BillingAddress?.FullName,
                BillingPhone = order.BillingAddress?.Phone,
                BillingCity = order.BillingAddress?.City,
                BillingDistrict = order.BillingAddress?.District,
                BillingFullAddress = order.BillingAddress?.FullAddress
            }).ToList();

            return Ok(result);
        }


        // ✅ Admin: tüm siparişleri gör

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<AdminOrderDto>>> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .Include(o => o.Items).ThenInclude(i => i.ColorOption)
                .Include(o => o.BillingAddress) // ✅ fatura adresi dahil
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
                    ColorName = i.ColorOption?.Name,
                    Description = i.Description,
                    Quantity = i.Quantity,
                    Price = i.Product.Price
                }).ToList(),

                // ✅ fatura adresi bilgilerini ekle
                BillingFullName = order.BillingAddress?.FullName,
                BillingPhone = order.BillingAddress?.Phone,
                BillingCity = order.BillingAddress?.City,
                BillingDistrict = order.BillingAddress?.District,
                BillingFullAddress = order.BillingAddress?.FullAddress
            }).ToList();

            return Ok(result);
        }



        // ✅ Admin: Sipariş statüsünü güncelle ve geçmişe kaydet
        [HttpPut("{orderId}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int orderId, [FromBody] UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound();

            order.Status = dto.Status;

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var history = new OrderStatusHistory
            {
                OrderId = orderId,
                Status = dto.Status,
                ChangedAt = DateTime.UtcNow,
                ChangedByUserId = userId
            };

            _context.OrderStatusHistories.Add(history);
            await _context.SaveChangesAsync();

            return Ok(order);
        }


        // ✅ Admin: Bugün / Ay / Yıl istatistikleri
        [HttpGet("admin-stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AdminStatsDto>> GetAdminStats()
        {
            var now = DateTime.UtcNow;
            var today = now.Date;
            var monthStart = new DateTime(now.Year, now.Month, 1);
            var yearStart = new DateTime(now.Year, 1, 1);

            var allOrders = await _context.Orders
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .Where(o => o.Status == "Tamamlandı")
                .ToListAsync();

            var stats = new AdminStatsDto
            {
                TotalOrders = allOrders.Count,
                TotalRevenue = allOrders.Sum(o => o.Items.Sum(i => i.Product.Price * i.Quantity)),

                TodayOrders = allOrders.Count(o => o.CreatedAt >= today),
                TodayRevenue = allOrders.Where(o => o.CreatedAt >= today)
                    .Sum(o => o.Items.Sum(i => i.Product.Price * i.Quantity)),

                MonthOrders = allOrders.Count(o => o.CreatedAt >= monthStart),
                MonthRevenue = allOrders.Where(o => o.CreatedAt >= monthStart)
                    .Sum(o => o.Items.Sum(i => i.Product.Price * i.Quantity)),

                YearOrders = allOrders.Count(o => o.CreatedAt >= yearStart),
                YearRevenue = allOrders.Where(o => o.CreatedAt >= yearStart)
                    .Sum(o => o.Items.Sum(i => i.Product.Price * i.Quantity)),

                TopProducts = allOrders.SelectMany(o => o.Items)
                    .GroupBy(i => i.Product.Name)
                    .Select(g => new ProductSalesDto
                    {
                        ProductName = g.Key,
                        TotalSold = g.Sum(i => i.Quantity)
                    })
                    .OrderByDescending(x => x.TotalSold)
                    .Take(5)
                    .ToList()
            };

            return Ok(stats);
        }

        // ✅ Admin: Özel tarih aralığı istatistiği
        [HttpPost("custom-stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CustomStatsResponseDto>> GetCustomStats([FromBody] CustomStatsRequestDto range)
        {
            if (range.StartDate > range.EndDate)
                return BadRequest("Başlangıç tarihi bitiş tarihinden büyük olamaz.");

            var orders = await _context.Orders
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .Where(o => o.Status == "Tamamlandı" &&
                            o.CreatedAt >= range.StartDate &&
                            o.CreatedAt <= range.EndDate)
                .ToListAsync();

            var stats = new CustomStatsResponseDto
            {
                OrderCount = orders.Count,
                Revenue = orders.Sum(o => o.Items.Sum(i => i.Product.Price * i.Quantity)),
                ProductSales = orders
                    .SelectMany(o => o.Items)
                    .GroupBy(i => i.Product.Name)
                    .Select(g => new ProductSalesDto
                    {
                        ProductName = g.Key,
                        TotalSold = g.Sum(i => i.Quantity)
                    })
                    .OrderByDescending(x => x.TotalSold)
                    .ToList()
            };

            return Ok(stats);
        }

        // ✅ Fatura Detayı (kullanıcı + admin erişimi)
        [HttpGet("{orderId}/invoice")]
        public async Task<ActionResult<InvoiceDto>> GetInvoice(int orderId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .Include(o => o.Items).ThenInclude(i => i.ColorOption)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null || (order.UserId != userId && !User.IsInRole("Admin")))
                return Unauthorized();

            var billingAddress = await _context.Addresses
                .Where(a => a.UserId == order.UserId && a.IsBillingAddress)
                .FirstOrDefaultAsync();

            var invoice = new InvoiceDto
            {
                OrderId = order.Id,
                FullName = order.User.FullName,
                Email = order.User.Email,
                OrderDate = order.CreatedAt,
                Status = order.Status,
                Items = order.Items.Select(i => new InvoiceItemDto
                {
                    ProductName = i.Product.Name,
                    Price = i.Product.Price,
                    Quantity = i.Quantity,
                    Color = i.ColorOption?.Name
                }).ToList(),
                BillingFullName = billingAddress?.FullName,
                BillingPhone = billingAddress?.Phone,
                BillingCity = billingAddress?.City,
                BillingDistrict = billingAddress?.District,
                BillingFullAddress = billingAddress?.FullAddress
            };

            return Ok(invoice);
        }

        [HttpGet("{orderId}/invoice/pdf")]
        public async Task<IActionResult> GetInvoicePdf(int orderId, [FromServices] InvoicePdfService pdfService)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .Include(o => o.Items).ThenInclude(i => i.ColorOption)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null || (order.UserId != userId && !User.IsInRole("Admin")))
                return Unauthorized();

            var billingAddress = await _context.Addresses
                .Where(a => a.UserId == order.UserId && a.IsBillingAddress)
                .FirstOrDefaultAsync();

            var invoice = new InvoiceDto
            {
                OrderId = order.Id,
                FullName = order.User.FullName,
                Email = order.User.Email,
                OrderDate = order.CreatedAt,
                Status = order.Status,
                Items = order.Items.Select(i => new InvoiceItemDto
                {
                    ProductName = i.Product.Name,
                    Price = i.Product.Price,
                    Quantity = i.Quantity,
                    Color = i.ColorOption?.Name
                }).ToList(),
                BillingFullName = billingAddress?.FullName,
                BillingPhone = billingAddress?.Phone,
                BillingCity = billingAddress?.City,
                BillingDistrict = billingAddress?.District,
                BillingFullAddress = billingAddress?.FullAddress
            };

            var pdfBytes = pdfService.Generate(invoice);
            return File(pdfBytes, "application/pdf", $"invoice-{invoice.OrderId}.pdf");
        }

        [HttpPost("{orderId}/invoice/send-email")]
        public async Task<IActionResult> SendInvoiceEmail(
            int orderId,
            [FromServices] EmailService emailService,
            [FromServices] InvoicePdfService pdfService)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .Include(o => o.Items).ThenInclude(i => i.ColorOption)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null || (order.UserId != userId && !User.IsInRole("Admin")))
                return Unauthorized();

            var billingAddress = await _context.Addresses
                .Where(a => a.UserId == order.UserId && a.IsBillingAddress)
                .FirstOrDefaultAsync();

            var invoice = new InvoiceDto
            {
                OrderId = order.Id,
                FullName = order.User.FullName,
                Email = order.User.Email,
                OrderDate = order.CreatedAt,
                Status = order.Status,
                Items = order.Items.Select(i => new InvoiceItemDto
                {
                    ProductName = i.Product.Name,
                    Price = i.Product.Price,
                    Quantity = i.Quantity,
                    Color = i.ColorOption?.Name
                }).ToList(),
                BillingFullName = billingAddress?.FullName,
                BillingPhone = billingAddress?.Phone,
                BillingCity = billingAddress?.City,
                BillingDistrict = billingAddress?.District,
                BillingFullAddress = billingAddress?.FullAddress
            };

            var pdf = pdfService.Generate(invoice);
            await emailService.SendInvoiceEmailAsync(invoice.Email, pdf, $"invoice-{invoice.OrderId}.pdf");

            return Ok("E-posta gönderildi.");
        }



    }
}
