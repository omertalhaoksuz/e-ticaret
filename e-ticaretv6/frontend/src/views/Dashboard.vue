<template>
  <div class="dashboard">
    <!-- Sol Menü -->
    <aside class="sidebar">
      <ul>
        <li :class="{ active: currentView === 'admin' }" @click="currentView = 'admin'">Admin Dashboard</li>
        <li :class="{ active: currentView === 'orders' }" @click="currentView = 'orders'">Orders</li>
        <li :class="{ active: currentView === 'colors' }" @click="currentView = 'colors'">Manage Colors</li>
        <li :class="{ active: currentView === 'pages' }" @click="currentView = 'pages'">Manage Pages</li>
        <li :class="{ active: currentView === 'products' }" @click="currentView = 'products'">Products</li>
      </ul>
    </aside>

    <!-- Sağ İçerik -->
    <section class="main-content">
      <component :is="currentComponent" />
    </section>
  </div>
</template>

<script>
// İçerik bileşenlerini import et (sonraki adımlarda her biri ayrı dosya olacak)
import AdminStats from '../components/admin/AdminStats.vue';
import OrderManagement from '../components/admin/OrderManagement.vue';
import ColorManager from '../components/admin/ColorManager.vue';
import PageManager from '../components/admin/PageManager.vue';
import ProductManager from '../components/admin/ProductManager.vue';

export default {
  data() {
    return {
      currentView: 'admin',
    };
  },
  computed: {
    currentComponent() {
      switch (this.currentView) {
        case 'orders': return OrderManagement;
        case 'colors': return ColorManager;
        case 'pages': return PageManager;
        case 'products': return ProductManager;
        default: return AdminStats;
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 80vh;
}
.sidebar {
  width: 220px;
  background-color: #f1f1f1;
  padding: 20px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin-bottom: 10px;
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
}
.sidebar li.active {
  background-color: #1a73e8;
  color: white;
}
.main-content {
  flex: 1;
  padding: 20px;
}
</style>
