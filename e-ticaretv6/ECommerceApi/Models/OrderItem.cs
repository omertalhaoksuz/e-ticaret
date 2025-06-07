namespace ECommerceApi.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

      

        // ✅ Eklenen alanlar — renk sabit olarak kopyalanır
        public string ColorName { get; set; } = string.Empty;
        public string ColorHex { get; set; } = "#000000";

        public string? Description { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
    }
}
