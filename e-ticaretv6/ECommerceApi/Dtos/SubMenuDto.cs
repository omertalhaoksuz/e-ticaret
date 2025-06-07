using System.Collections.Generic;

namespace ECommerceApi.Dtos
{
    public class SubMenuDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<ProductDto> Products { get; set; }
    }
}
