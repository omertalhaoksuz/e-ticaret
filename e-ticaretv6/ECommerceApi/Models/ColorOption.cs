using System.Collections.Generic;

namespace ECommerceApi.Models
{
    public class ColorOption
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ICollection<ProductColorOption>? ProductColorOptions { get; set; }

    }
}
