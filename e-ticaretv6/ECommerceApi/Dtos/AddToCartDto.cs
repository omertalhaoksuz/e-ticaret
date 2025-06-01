namespace ECommerceApi.Dtos
{
    public class AddToCartDto
    {
        public int ProductId { get; set; }
        public int? ColorOptionId { get; set; } // Opsiyonel
        public string? Description { get; set; }
        public int Quantity { get; set; } = 1;
    }
}
