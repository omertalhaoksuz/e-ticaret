using Microsoft.AspNetCore.Identity;

namespace ECommerceApi.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; }
        public string Role { get; set; } // "Admin" ya da "User"
    }
}
