using System.Collections.Generic;
using System;

namespace ECommerceApi.Models
{
    public class Order
    {
        public int Id { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }
        

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending"; // status

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        // 🟨  Adres
        public int? AddressId { get; set; }
        public Address? Address { get; set; }
        public int? BillingAddressId { get; set; }
        public Address? BillingAddress { get; set; }

    }
}
