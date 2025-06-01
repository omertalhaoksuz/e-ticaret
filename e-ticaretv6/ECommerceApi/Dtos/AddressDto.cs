namespace ECommerceApi.Dtos
{
    public class AddressDto
    {
        public string Title { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string FullAddress { get; set; }
        public bool IsBillingAddress { get; set; }
    }
}
