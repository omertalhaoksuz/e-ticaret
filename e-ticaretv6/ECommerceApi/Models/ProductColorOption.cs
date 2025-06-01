namespace ECommerceApi.Models
{
    public class ProductColorOption
    {
        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int ColorOptionId { get; set; }
        public ColorOption ColorOption { get; set; }
    }
}
