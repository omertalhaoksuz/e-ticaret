using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ECommerceApi.Models;

namespace ECommerceApi.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<ColorOption> ColorOptions { get; set; }
        public DbSet<ProductColorOption> ProductColorOptions { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }
        public DbSet<Address> Addresses { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Many-to-Many: Product <-> ColorOption
            modelBuilder.Entity<ProductColorOption>()
                .HasKey(pco => new { pco.ProductId, pco.ColorOptionId });

            modelBuilder.Entity<ProductColorOption>()
                .HasOne(pco => pco.Product)
                .WithMany(p => p.ProductColorOptions)
                .HasForeignKey(pco => pco.ProductId);

            modelBuilder.Entity<ProductColorOption>()
                .HasOne(pco => pco.ColorOption)
                .WithMany(c => c.ProductColorOptions)
                .HasForeignKey(pco => pco.ColorOptionId);

            // Price için decimal hassasiyeti
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);
            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.User)
                 .WithMany()
                .HasForeignKey(ci => ci.UserId);

            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Product)
                .WithMany()
                .HasForeignKey(ci => ci.ProductId);

            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.ColorOption)
                .WithMany()
                .HasForeignKey(ci => ci.ColorOptionId)
                .OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<Order>()
                .HasOne(o => o.BillingAddress)
                .WithMany()
                .HasForeignKey(o => o.BillingAddressId)
                .OnDelete(DeleteBehavior.SetNull); // Adres silinirse, sipariş bozulmasın


        }
    }
}
