<template>
  <div class="cart-container">
    <h2>My Cart</h2>

    <div v-if="items.length === 0">
      <p>Your cart is empty.</p>
    </div>

    <div v-else>
      <div class="cart-item" v-for="item in items" :key="item.id">
        <img :src="getImageUrl(item.product.imageUrl)" alt="product" />
        <div class="item-info">
          <h4>{{ item.product.name }}</h4>
          <p>Quantity: {{ item.quantity }}</p>
          <p>Price: {{ item.product.price.toFixed(2) }} ₺</p>
          <p v-if="item.colorOption">Color: {{ item.colorOption.name }}</p>
        </div>
        <button @click="removeItem(item.id)">🗑</button>
      </div>

      <div class="cart-summary">
        <p><strong>Total:</strong> {{ totalPrice.toFixed(2) }} ₺</p>
        <button @click="checkout">Proceed to Checkout</button>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      items: [],
      successMessage: '',
    };
  },
  computed: {
    totalPrice() {
      return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    },
  },
  methods: {
    getImageUrl(url) {
      return url.startsWith('/') ? `http://localhost:7082${url}` : url;
    },
    async fetchCart() {
      const token = localStorage.getItem('token');
      if (!token) return this.$router.push('/login');

      try {
        const res = await axios.get('http://localhost:7082/api/Cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.items = res.data;
      } catch (err) {
        console.error('Sepet alınamadı:', err);
      }
    },
    async removeItem(id) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:7082/api/Cart/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.items = this.items.filter((item) => item.id !== id);
      } catch (err) {
        console.error('Silinemedi:', err);
      }
    },
    async checkout() {
      const token = localStorage.getItem('token');
      try {
        // Backend default fatura adresini kendisi alıyor
        const res = await axios.post(
          'http://localhost:7082/api/Order/create',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const orderId = res.data.orderId;

        // PDF e-posta gönder
        await axios.post(
          `http://localhost:7082/api/Order/${orderId}/invoice/send-email`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.successMessage = 'Order completed. Invoice has been sent to your email.';
        this.items = [];
      } catch (err) {
        console.error('Checkout failed:', err);
      }
    },
  },
  mounted() {
    this.fetchCart();
  },
};
</script>

<style scoped>
.cart-container {
  max-width: 800px;
  margin: 30px auto;
}
.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 15px 0;
}
.cart-item img {
  width: 80px;
  height: auto;
  border-radius: 6px;
  margin-right: 20px;
}
.item-info {
  flex: 1;
}
button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.cart-summary {
  text-align: right;
  margin-top: 20px;
}
.cart-summary button {
  background-color: #1a73e8;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.success {
  color: green;
  margin-top: 10px;
}
</style>
