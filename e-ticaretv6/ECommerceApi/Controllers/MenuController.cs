using ECommerceApi.Data;
using ECommerceApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using ECommerceApi.Dtos;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class MenuController : ControllerBase
{
    private readonly AppDbContext _context;

    public MenuController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMenus()
    {
        var menus = await _context.Menus
            .Include(m => m.Products) // Doğrudan menüye atanmış ürünler
            .Include(m => m.SubMenus)
                .ThenInclude(s => s.Products)
            .ToListAsync();

        var result = menus.Select(m => new MenuDto
        {
            Id = m.Id,
            Name = m.Name,

            // Doğrudan menüye atanmış ürünler
            Products = m.Products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name
            }).ToList(),

            // Alt menüler ve ürünleri
            SubMenus = m.SubMenus.Select(s => new SubMenuDto
            {
                Id = s.Id,
                Name = s.Name,
                Products = s.Products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name
                }).ToList()
            }).ToList()
        });

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMenu([FromBody] Menu menu)
    {
        menu.SubMenus = new List<SubMenu>(); // NULL referans engelle
        menu.Products = new List<Product>();
        _context.Menus.Add(menu);
        await _context.SaveChangesAsync();
        return Ok(menu);
    }

    [HttpPost("AssignProduct")]
    public async Task<IActionResult> AssignProductToMenu(int productId, int menuId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null) return NotFound();

        product.MenuId = menuId;
        product.SubMenuId = null; // ALT MENÜ İLİŞKİSİNİ TEMİZLE
        await _context.SaveChangesAsync();

        return Ok();
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMenu(int id)
    {
        var menu = await _context.Menus.Include(m => m.SubMenus).FirstOrDefaultAsync(m => m.Id == id);
        if (menu == null) return NotFound();

        _context.Menus.Remove(menu);
        await _context.SaveChangesAsync();
        return Ok();
    }
    [HttpDelete("UnassignProduct")]
    public async Task<IActionResult> UnassignProductFromMenu(int productId, int menuId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null) return NotFound();

        if (product.MenuId == menuId)
        {
            product.MenuId = null;
            await _context.SaveChangesAsync();
        }

        return Ok();
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetMenuById(int id)
    {
        var menu = await _context.Menus
            .Include(m => m.Products)
            .Include(m => m.SubMenus)
                .ThenInclude(s => s.Products)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (menu == null) return NotFound();

        var result = new MenuDto
        {
            Id = menu.Id,
            Name = menu.Name,
            Products = menu.Products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name
            }).ToList(),
            SubMenus = menu.SubMenus.Select(s => new SubMenuDto
            {
                Id = s.Id,
                Name = s.Name,
                Products = s.Products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name
                }).ToList()
            }).ToList()
        };

        return Ok(result);
    }


}
