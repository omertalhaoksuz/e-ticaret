using ECommerceApi.Data;
using ECommerceApi.Dtos;
using ECommerceApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class SubMenuController : ControllerBase
{
    private readonly AppDbContext _context;

    public SubMenuController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateSubMenu([FromBody] SubMenu subMenu)
    {
        subMenu.Products = new List<Product>(); // null hatası engellenir
        _context.SubMenus.Add(subMenu);
        await _context.SaveChangesAsync();
        return Ok(subMenu);
    }

    [HttpPost("AssignProduct")]
    public async Task<IActionResult> AssignProductToSubMenu(int productId, int subMenuId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null) return NotFound();

        product.SubMenuId = subMenuId;
        product.MenuId = null; // ✨ Menü ile ilişki silinsin ki sadece submenuye ait görünsün
        await _context.SaveChangesAsync();

        return Ok();
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSubMenu(int id)
    {
        var sub = await _context.SubMenus.Include(s => s.Products).FirstOrDefaultAsync(s => s.Id == id);
        if (sub == null) return NotFound();

        _context.SubMenus.Remove(sub);
        await _context.SaveChangesAsync();
        return Ok();
    }
    [HttpDelete("UnassignProduct")]
    public async Task<IActionResult> UnassignProductFromSubMenu(int productId, int subMenuId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null) return NotFound();

        if (product.SubMenuId == subMenuId)
        {
            product.SubMenuId = null;
            await _context.SaveChangesAsync();
        }

        return Ok();
    }
    [HttpGet("/api/submenu/{id}")]
    public async Task<IActionResult> GetSubMenuById(int id)
    {
        var subMenu = await _context.SubMenus
            .Include(s => s.Products)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (subMenu == null) return NotFound();

        var result = new SubMenuDto
        {
            Id = subMenu.Id,
            Name = subMenu.Name,
            Products = subMenu.Products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                Description = p.Description
            }).ToList()
        };

        return Ok(result);
    }

}
