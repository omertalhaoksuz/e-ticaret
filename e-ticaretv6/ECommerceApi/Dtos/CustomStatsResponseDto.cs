using System.Collections.Generic;

namespace ECommerceApi.Dtos
{
    public class CustomStatsResponseDto
    {
        public int OrderCount { get; set; }
        public decimal Revenue { get; set; }
        public List<ProductSalesDto> ProductSales { get; set; } = new();
    }
}
