<template>
  <div class="home">
    <!-- About Section -->
    <section class="about-section">
      <div class="about-text">
        <h2>Welcome to our 3D Printing Store</h2>
        <p>Discover exclusive and customizable 3D printed products tailored for your needs.</p>
      </div>
      <div class="about-image">
        <img src="@/assets/about.jpg" alt="About" />
      </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-section">
      <h3>Featured Products</h3>
      <div class="product-grid">
        <div
          v-for="product in featuredProducts"
          :key="product.id"
          class="product-card"
          @click="openModal(product)"
        >
          <img :src="getImageUrl(product.imageUrl)" alt="Product" />
          <h4>{{ product.name }}</h4>
          <p>{{ product.price.toFixed(2) }} ₺</p>
        </div>
      </div>
    </section>

    <!-- Product Modal -->
    <div class="modal" v-if="selectedProduct">
      <div class="modal-content">
        <button class="close-button" @click="selectedProduct = null">✖</button>
        <img :src="getImageUrl(selectedProduct.imageUrl)" alt="Popup" />
        <h3>{{ selectedProduct.name }}</h3>
        <p>{{ selectedProduct.price.toFixed(2) }} ₺</p>
        <div v-if="selectedProduct.productColorOptions?.length">
          <label>Available Colors:</label>
          <ul class="color-list">
            <li
              v-for="opt in selectedProduct.productColorOptions"
              :key="opt.colorOption.id"
            >
              {{ opt.colorOption.name }}
            </li>
          </ul>
        </div>
        <p class="description">{{ selectedProduct.description }}</p>
        <button @click="addToCart(selectedProduct)">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      allProducts: [],
      selectedProduct: null,
    };
  },
  computed: {
    featuredProducts() {
      return this.allProducts.filter((p) => p.showOnHome);
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await axios.get('https://localhost:7082/api/Product');
        this.allProducts = res.data;
      } catch (err) {
        console.error('Ürünler alınamadı:', err);
      }
    },
    getImageUrl(url) {
  if (!url) return '';
  return url.startsWith('/') ? `https://localhost:7082${url}` : url;
    },
    openModal(product) {
      this.selectedProduct = product;
    },
    async addToCart(product) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Lütfen giriş yapınız.');
        return;
      }

      try {
        const selectedColorId = product.productColorOptions?.[0]?.colorOption?.id || null;

        await axios.post(
          'https://localhost:7082/api/Cart/add',
          {
            productId: product.id,
            quantity: 1,
            colorOptionId: selectedColorId,
            description: '',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Ürün sepete eklendi');
        this.selectedProduct = null;
      } catch (err) {
        console.error('Sepete eklenemedi:', err);
      }
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
}

.about-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
}

.about-text {
  flex: 1;
}

.about-image img {
  width: 250px;
  height: auto;
  border-radius: 8px;
}

.featured-section {
  text-align: center;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.product-card {
  width: 200px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.product-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.product-card img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  width: 400px;
  background: white;
  padding: 20px;
  position: relative;
  border-radius: 8px;
}

.modal-content img {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.color-list {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.description {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.modal-content button {
  background-color: #1a73e8;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
