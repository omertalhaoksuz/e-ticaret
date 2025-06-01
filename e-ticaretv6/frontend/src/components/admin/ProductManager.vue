<template>
  <div class="product-manager">
    <div class="header">
      <h2>Manage Products</h2>
      <button @click="showModal = true">+ Add New Product</button>
    </div>

    <!-- Ürün Listesi -->
    <div v-for="product in products" :key="product.id" class="product-card">
      <img :src="getImageUrl(product.imageUrl)" alt="Product" />
      <div>
        <h4>{{ product.name }}</h4>
        <p>{{ product.price.toFixed(2) }} ₺</p>
        <button @click="deleteProduct(product.id)">❌ Delete</button>
      </div>
    </div>

    <!-- Yeni Ürün Ekleme Modalı -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <h3>New Product</h3>
        <form @submit.prevent="addProduct">
          <input v-model="newProduct.name" placeholder="Product name" required />
          <input v-model.number="newProduct.price" type="number" placeholder="Price" required />
          <textarea v-model="newProduct.description" placeholder="Description"></textarea>
          <input type="file" @change="handleFile" required />

          <div class="modal-actions">
            <button type="submit">Save</button>
            <button type="button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
      showModal: false,
      selectedFile: null,
      newProduct: {
        name: '',
        price: 0,
        description: '',
      },
    };
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const resProducts = await axios.get('https://localhost:7082/api/Product', { headers });
      this.products = resProducts.data;
    },
    getImageUrl(url) {
      if (!url) return '';
      return url.startsWith('/') ? `https://localhost:7082${url}` : url;
    },
    handleFile(e) {
      this.selectedFile = e.target.files[0];
    },
    closeModal() {
      this.showModal = false;
      this.newProduct = {
        name: '',
        price: 0,
        description: '',
      };
      this.selectedFile = null;
    },
    async addProduct() {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', this.newProduct.name);
      formData.append('price', this.newProduct.price);
      formData.append('description', this.newProduct.description || '');
      formData.append('image', this.selectedFile);

      try {
        await axios.post('https://localhost:7082/api/Product/upload', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        await this.fetchData();
        this.closeModal();
        alert('Product added.');
      } catch (err) {
        console.error('Add failed:', err);
      }
    },
    async deleteProduct(id) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`https://localhost:7082/api/Product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.products = this.products.filter(p => p.id !== id);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    },
  },
};
</script>

<style scoped>
.product-manager {
  max-width: 1000px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.product-card {
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid #ccc;
  margin: 15px 0;
  padding: 10px;
  border-radius: 6px;
}
.product-card img {
  width: 80px;
  height: auto;
  border-radius: 4px;
}
button {
  padding: 6px 12px;
  cursor: pointer;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 8px;
}
.modal-content input,
.modal-content textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
}
</style>
