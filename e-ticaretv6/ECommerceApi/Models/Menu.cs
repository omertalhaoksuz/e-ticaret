using System.Collections.Generic;

namespace ECommerceApi.Models
{
    public class Menu
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<SubMenu> SubMenus { get; set; }
        public ICollection<Product> Products { get; set; }
    }
}
