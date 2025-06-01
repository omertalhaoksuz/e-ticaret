<template>
  <header class="header">
    <nav class="nav">
      <!-- Sol: Ana Sayfa -->
      <router-link to="/" class="nav-link">Home</router-link>

      <!-- Admin ise Dashboard -->
      <router-link v-if="isAdmin" to="/dashboard" class="nav-link">Dashboard</router-link>

      <!-- Ortadaki 5 Dropdown Butonu -->
      <div
        v-for="n in 5"
        :key="n"
        class="dropdown"
        @mouseenter="showDropdown(n)"
        @mouseleave="delayedHideDropdown"
      >
        <button class="nav-link dropdown-btn">Button {{ n }}</button>
        <div
          class="dropdown-content"
          v-show="activeDropdown === n"
        >
          <button
            v-for="product in filteredProducts(n)"
            :key="product.id"
            class="dropdown-item"
            @click="openModal(product)"
          >
            {{ product.name }}
          </button>
        </div>
      </div>

      <!-- Sağ: Auth -->
      <div class="auth-buttons">
        <router-link v-if="!isAuthenticated" to="/login" class="nav-link">Login</router-link>
        <router-link v-if="!isAuthenticated" to="/register" class="nav-link">Register</router-link>
        <router-link v-if="isAuthenticated" to="/profile" class="nav-link">Profile</router-link>
        <router-link v-if="isAuthenticated" to="/cart" class="nav-link">Cart</router-link>
      </div>
    </nav>

    <!-- Global Modal (isteğe bağlı, buraya taşıyabilirsin) -->
    <ProductModal
      :product="selectedProduct"
      v-if="selectedProduct"
      @close="selectedProduct = null"
    />
  </header>
</template>

<script>
import ProductModal from './ProductModal.vue';

export default {
  components: {
    ProductModal,
  },
  props: ['products'],
  data() {
    return {
      selectedProduct: null,
      activeDropdown: null,
      closeTimeout: null,
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
    },
    isAdmin() {
      return localStorage.getItem('role') === 'Admin';
    },
  },
  methods: {
    filteredProducts(buttonIndex) {
      return this.products.filter((p) => p[`showOnButton${buttonIndex}`]);
    },
    openModal(product) {
      this.selectedProduct = product;
    },
    showDropdown(index) {
      clearTimeout(this.closeTimeout);
      this.activeDropdown = index;
    },
    delayedHideDropdown() {
      this.closeTimeout = setTimeout(() => {
        this.activeDropdown = null;
      }, 300); // 0.3 saniye gecikmeli kapanış
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #1a73e8;
  padding: 14px 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.nav-link {
  text-decoration: none;
  padding: 10px 16px;
  color: white;
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s ease;
}
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}
.dropdown {
  position: relative;
}
.dropdown-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px 16px;
  color: white;
  font-weight: bold;
  font-size: 16px;
}
.dropdown-content {
  position: absolute;
  top: 40px;
  left: 0;
  background-color: white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  min-width: 160px;
  border-radius: 6px;
}
.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 15px;
  font-weight: 500;
}
.dropdown-item:hover {
  background-color: #f0f0f0;
}
.auth-buttons {
  margin-left: auto;
  display: flex;
  gap: 12px;
}
</style>
