using System.Collections.Generic;
using System;

namespace ECommerceApi.Dtos
{
    public class CreatedOrderDto
    {
        public int OrderId { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }
}
