namespace ECommerceApi.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        public string UserId { get; set; } // Kullanıcıya özel
        public User User { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int? ColorOptionId { get; set; }
        public ColorOption? ColorOption { get; set; }

        public string? Description { get; set; } // Kullanıcının açıklaması
        public int Quantity { get; set; } = 1; // Adet
    }
}
