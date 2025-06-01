<template>
  <div class="orders">
    <h2>Order Management</h2>

    <!-- Durum Butonları -->
    <div class="status-tabs">
      <button
        v-for="s in statuses"
        :key="s"
        :class="{ active: currentStatus === s }"
        @click="currentStatus = s"
      >
        {{ s }}
      </button>
    </div>

    <!-- Sipariş Listesi -->
    <div v-for="order in filteredOrders" :key="order.orderId" class="order-card">
      <h4>#{{ order.orderId }} - {{ order.userFullName }} ({{ order.userEmail }})</h4>
      <p>Status: <strong>{{ order.status }}</strong> - {{ order.createdAt.substring(0, 10) }}</p>

      <ul>
        <li v-for="item in order.items" :key="item.productName">
          {{ item.productName }} - {{ item.quantity }}x - {{ item.colorName || 'No Color' }}
        </li>
      </ul>

      <!-- Durum Güncelleme -->
      <select v-model="order.newStatus">
        <option disabled value="">Change status</option>
        <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
      </select>
      <button @click="updateStatus(order)">Update</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [],
      currentStatus: 'Pending',
      statuses: ['Pending', 'Aktif', 'Tamamlandı', 'Reddedildi'],
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter((o) => o.status === this.currentStatus);
    },
  },
  async mounted() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://localhost:7082/api/Order/all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      this.orders = res.data.map((o) => ({
        ...o,
        newStatus: '',
      }));
    },
    async updateStatus(order) {
      if (!order.newStatus || order.newStatus === order.status) return;

      const token = localStorage.getItem('token');
      try {
        await axios.put(
          `https://localhost:7082/api/Order/${order.orderId}/status`,
          { status: order.newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        order.status = order.newStatus;
        order.newStatus = '';
        alert('Status updated.');
      } catch (err) {
        console.error('Status update failed:', err);
      }
    },
  },
};
</script>

<style scoped>
.orders {
  max-width: 1000px;
  margin: 0 auto;
}
.status-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.status-tabs button {
  padding: 8px 16px;
  background-color: #eee;
  border: none;
  cursor: pointer;
}
.status-tabs .active {
  background-color: #1a73e8;
  color: white;
}
.order-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 6px;
}
select {
  margin-top: 10px;
  padding: 6px;
}
button {
  margin-left: 10px;
  padding: 6px 10px;
}
</style>
