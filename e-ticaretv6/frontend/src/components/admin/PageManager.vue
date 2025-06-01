<template>
  <div class="page-manager">
    <h2>Manage Page Display</h2>

    <div v-for="product in products" :key="product.id" class="product-card">
      <h4>{{ product.name }}</h4>
      <div class="checkbox-group">
        <label>
          <input type="checkbox" v-model="product.showOnHome" />
          Show on Home
        </label>
        <label v-for="n in 5" :key="n">
          <input type="checkbox" v-model="product[`showOnButton${n}`]" />
          Show on Button {{ n }}
        </label>
      </div>
      <button @click="saveDisplaySettings(product)">Save</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
    };
  },
  async mounted() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://localhost:7082/api/Product', {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.products = res.data;
    },
    async saveDisplaySettings(product) {
      const token = localStorage.getItem('token');
      try {
        await axios.put(
          `https://localhost:7082/api/Product/display-settings/${product.id}`,
          {
            showOnHome: product.showOnHome,
            showOnButton1: product.showOnButton1,
            showOnButton2: product.showOnButton2,
            showOnButton3: product.showOnButton3,
            showOnButton4: product.showOnButton4,
            showOnButton5: product.showOnButton5,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert('Display settings updated.');
      } catch (err) {
        console.error('Update failed:', err);
      }
    },
  },
};
</script>

<style scoped>
.page-manager {
  max-width: 900px;
  margin: 0 auto;
}
.product-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 10px 0;
}
button {
  padding: 6px 12px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
