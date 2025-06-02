using System;
using System.Collections.Generic;

namespace ECommerceApi.Dtos
{
    public class AdminOrderDto
    {
        public int OrderId { get; set; }
        public string UserEmail { get; set; }
        public string UserFullName { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal Price { get; set; }

        public List<OrderItemDto> Items { get; set; } = new();
        // ✅ Fatura adresi detayları
        public string? BillingFullName { get; set; }
        public string? BillingPhone { get; set; }
        public string? BillingCity { get; set; }
        public string? BillingDistrict { get; set; }
        public string? BillingFullAddress { get; set; }
    }
}
