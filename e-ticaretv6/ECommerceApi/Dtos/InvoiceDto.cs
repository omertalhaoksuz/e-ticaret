using System.Collections.Generic;
using System;
using System.Linq;


namespace ECommerceApi.Dtos
{
    public class InvoiceDto
    {
        public int OrderId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }

        public List<InvoiceItemDto> Items { get; set; } = new();
        public decimal TotalAmount => Items.Sum(i => i.Price * i.Quantity);
        public string? BillingFullName { get; set; }
        public string? BillingPhone { get; set; }
        public string? BillingCity { get; set; }
        public string? BillingDistrict { get; set; }
        public string? BillingFullAddress { get; set; }

    }

    public class InvoiceItemDto
    {
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string? Color { get; set; }
        public string? Description { get; set; }
    }
}
