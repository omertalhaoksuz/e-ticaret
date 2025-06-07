// OrderDetailDto.cs
using System;
using System.Collections.Generic;

namespace ECommerceApi.Dtos
{
    public class OrderDetailDto
    {
        public int OrderId { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; }

        public List<OrderItemDto> Items { get; set; } = new();
        public string? BillingFullName { get; set; }
        public string? BillingPhone { get; set; }
        public string? BillingCity { get; set; }
        public string? BillingDistrict { get; set; }
        public string? BillingFullAddress { get; set; }
    }
}
