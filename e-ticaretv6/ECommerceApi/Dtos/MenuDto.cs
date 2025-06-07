using System.Collections.Generic;

namespace ECommerceApi.Dtos
{
    public class MenuDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<SubMenuDto> SubMenus { get; set; }
        public List<ProductDto> Products { get; set; }
    }
}
