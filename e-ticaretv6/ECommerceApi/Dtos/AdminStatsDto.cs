using System.Collections.Generic;

namespace ECommerceApi.Dtos
{
    public class AdminStatsDto
    {
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }

        public int TodayOrders { get; set; }
        public decimal TodayRevenue { get; set; }

        public int MonthOrders { get; set; }
        public decimal MonthRevenue { get; set; }

        public int YearOrders { get; set; }
        public decimal YearRevenue { get; set; }

        public List<ProductSalesDto> TopProducts { get; set; } = new();
    }

    public class ProductSalesDto
    {
        public string ProductName { get; set; }
        public int TotalSold { get; set; }
    }
}
