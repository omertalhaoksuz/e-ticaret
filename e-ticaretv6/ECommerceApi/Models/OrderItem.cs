namespace ECommerceApi.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int? ColorOptionId { get; set; }
        public ColorOption? ColorOption { get; set; }

        public string? Description { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
    }
}
