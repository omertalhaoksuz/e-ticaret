using System.Collections.Generic;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public List<string> Colors { get; set; } = new();
    public bool ShowOnHome { get; set; }
}
