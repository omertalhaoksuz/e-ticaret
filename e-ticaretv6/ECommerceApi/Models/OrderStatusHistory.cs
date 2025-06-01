using System;

namespace ECommerceApi.Models
{
    public class OrderStatusHistory
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }

        public string Status { get; set; }
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        public string? ChangedByUserId { get; set; }
        public User? ChangedByUser { get; set; }
    }
}
