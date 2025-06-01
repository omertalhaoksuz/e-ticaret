<template>
  <div class="admin-stats">
    <h2>Admin Dashboard</h2>

    <!-- Kartlar -->
    <div class="stats-cards">
      <div class="card">
        <h4>Today</h4>
        <p>Orders: {{ stats.todayOrders }}</p>
        <p>Revenue: {{ stats.todayRevenue.toFixed(2) }} ₺</p>
      </div>
      <div class="card">
        <h4>This Month</h4>
        <p>Orders: {{ stats.monthOrders }}</p>
        <p>Revenue: {{ stats.monthRevenue.toFixed(2) }} ₺</p>
      </div>
      <div class="card">
        <h4>This Year</h4>
        <p>Orders: {{ stats.yearOrders }}</p>
        <p>Revenue: {{ stats.yearRevenue.toFixed(2) }} ₺</p>
      </div>
    </div>

    <!-- Bar Chart -->
    <div class="chart">
      <h3>Top 5 Products</h3>
      <ul>
        <li v-for="product in stats.topProducts" :key="product.productName">
          {{ product.productName }} - {{ product.totalSold }} sold
        </li>
      </ul>
    </div>

    <!-- Tarih Aralığı Sorgu -->
    <div class="date-query">
      <h4>Custom Date Range</h4>
      <input type="date" v-model="startDate" />
      <input type="date" v-model="endDate" />
      <button @click="fetchCustomStats">Fetch</button>

      <div v-if="customStats">
        <p><strong>Orders:</strong> {{ customStats.orderCount }}</p>
        <p><strong>Revenue:</strong> {{ customStats.revenue.toFixed(2) }} ₺</p>
        <ul>
          <li v-for="p in customStats.productSales" :key="p.productName">
            {{ p.productName }} - {{ p.totalSold }} sold
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      stats: {
        todayOrders: 0,
        todayRevenue: 0,
        monthOrders: 0,
        monthRevenue: 0,
        yearOrders: 0,
        yearRevenue: 0,
        topProducts: [],
      },
      startDate: '',
      endDate: '',
      customStats: null,
    };
  },
  async mounted() {
    await this.fetchStats();
  },
  methods: {
    async fetchStats() {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://localhost:7082/api/Order/admin-stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.stats = res.data;
    },
    async fetchCustomStats() {
      if (!this.startDate || !this.endDate) return;
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://localhost:7082/api/Order/custom-stats',
        {
          startDate: this.startDate,
          endDate: this.endDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      this.customStats = res.data;
    },
  },
};
</script>

<style scoped>
.admin-stats {
  max-width: 1000px;
  margin: 0 auto;
}
.stats-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}
.card {
  flex: 1;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.chart {
  margin-bottom: 30px;
}
.date-query input {
  margin-right: 10px;
}
.date-query button {
  padding: 6px 12px;
}
</style>
