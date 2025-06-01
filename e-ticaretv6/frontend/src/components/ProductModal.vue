<template>
  <div class="modal" v-if="product">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">✖</button>
      <img :src="getImageUrl(product.imageUrl)" alt="Product Image" />
      <h3>{{ product.name }}</h3>
      <p>{{ product.price.toFixed(2) }} ₺</p>

      <div v-if="product.productColorOptions?.length">
        <label>Available Colors:</label>
        <ul class="color-list">
          <li v-for="opt in product.productColorOptions" :key="opt.colorOption.id">
            {{ opt.colorOption.name }}
          </li>
        </ul>
      </div>

      <p class="description">{{ product.description }}</p>
      <button @click="addToCart(product)">Add to Cart</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['product'],
  methods: {
    getImageUrl(url) {
      if (!url) return '';
      return url.startsWith('/') ? `https://localhost:7082${url}` : url;
    },
    async addToCart(product) {
      const token = localStorage.getItem('token');
      if (!token) return alert('Please login first.');

      const selectedColorId = product.productColorOptions?.[0]?.colorOption?.id || null;

      try {
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
        alert('Product added to cart!');
        this.$emit('close');
      } catch (err) {
        console.error('Sepete eklenemedi:', err);
      }
    },
  },
};
</script>

<style scoped>
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
  z-index: 999;
}
.modal-content {
  width: 400px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  position: relative;
}
.modal-content img {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}
.color-list {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 10px;
  margin: 10px 0;
}
.close-button {
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  font-size: 18px;
  border: none;
  cursor: pointer;
}
.modal-content button {
  background-color: #1a73e8;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
