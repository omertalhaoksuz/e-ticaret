namespace ECommerceApi.Models
{
    public class Address
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }

        public string Title { get; set; } // Örn: Ev, Ofis
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string FullAddress { get; set; }

        public bool IsBillingAddress { get; set; }
    }
}
