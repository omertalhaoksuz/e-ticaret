using System.Collections.Generic;
using System;

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

    public class OrderItemDto
    {
        public string ProductName { get; set; }
        public string ImageUrl { get; set; }
        public string? ColorName { get; set; }
        public string? Description { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
