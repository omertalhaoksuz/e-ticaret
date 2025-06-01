using System.Collections.Generic;

namespace ECommerceApi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; } // Ürün fotoğrafı
        public string? Description { get; set; } // Açıklama
        public List<string>? Colors { get; set; } // Renkler (admin ekler)
        public ICollection<ProductColorOption>? ProductColorOptions { get; set; }

        // ✅ Sayfa gösterim ayarları
        public bool ShowOnHome { get; set; } = false;
        public bool ShowOnButton1 { get; set; } = false;
        public bool ShowOnButton2 { get; set; } = false;
        public bool ShowOnButton3 { get; set; } = false;
        public bool ShowOnButton4 { get; set; } = false;
        public bool ShowOnButton5 { get; set; } = false;
    }
}
