// Dosya: Dtos/Shared/OrderItemDto.cs
namespace ECommerceApi.Dtos
{
    public class OrderItemDto
    {
        public string ProductName { get; set; }
        public string ImageUrl { get; set; }
        public string ColorName { get; set; } = "";
        public string ColorHex { get; set; } = "#000000";
        public string? Description { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
