<template>
  <div class="profile-container">
    <!-- Profil Üst Bilgi -->
    <div class="profile-header">
      <img src="@/assets/avatar.png" alt="Profile Picture" />
      <div class="profile-info">
        <h2>{{ user.fullName }}</h2>
        <p>{{ user.email }}</p>
        <p>{{ user.phone || 'No phone' }}</p>
      </div>
      <button @click="logout" class="logout-button">Logout</button>
    </div>

    <!-- Profili Düzenle -->
    <section class="edit-profile">
      <button @click="editMode = !editMode">
        {{ editMode ? 'Cancel' : 'Edit Profile' }}
      </button>

      <form v-if="editMode" @submit.prevent="updateProfile">
        <label>Full Name:</label>
        <input type="text" v-model="editForm.fullName" required />

        <label>Phone:</label>
        <input type="text" v-model="editForm.phone" />

        <button type="submit">Save Changes</button>
      </form>
    </section>

    <!-- Siparişler -->
    <section class="orders">
      <h3>My Orders</h3>

      <!-- Filtreleme -->
      <div class="filter-buttons">
        <button @click="filteredStatus = 'All'">All</button>
        <button @click="filteredStatus = 'Aktif'">Active</button>
        <button @click="filteredStatus = 'Tamamlandı'">Completed</button>
        <button @click="filteredStatus = 'Reddedildi'">Rejected</button>
      </div>

      <div v-if="filteredOrders.length === 0">
        <p>No orders found.</p>
      </div>

      <div v-for="order in filteredOrders" :key="order.orderId" class="order-card">
        <h4>Order #{{ order.orderId }} - {{ order.status }}</h4>
        <p>Date: {{ order.createdAt.substring(0, 10) }}</p>
        <ul>
          <li v-for="item in order.items" :key="item.productName">
            {{ item.productName }} ({{ item.quantity }}x)
            <span v-if="item.colorName"> - {{ item.colorName }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        fullName: '',
        email: '',
        phone: '',
      },
      editForm: {
        fullName: '',
        phone: '',
      },
      editMode: false,
      orders: [],
      filteredStatus: 'All',
    };
  },
  computed: {
    filteredOrders() {
      if (this.filteredStatus === 'All') return this.orders;
      return this.orders.filter(o => o.status === this.filteredStatus);
    },
  },
  async mounted() {
    const token = localStorage.getItem('token');
    if (!token) return this.$router.push('/login');

    try {
      // Token'dan kullanıcı bilgisi çöz
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.user.fullName = payload.name || '';
      this.user.email = payload.email || '';
      this.user.phone = payload.phone || '';

      this.editForm.fullName = this.user.fullName;
      this.editForm.phone = this.user.phone;

      // Siparişleri getir
      const res = await fetch('https://localhost:7082/api/Order/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.orders = await res.json();
    } catch (err) {
      console.error('Hata:', err);
      this.$router.push('/login');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.$router.push('/login');
    },
    async updateProfile() {
      const token = localStorage.getItem('token');
      try {
        await fetch('https://localhost:7082/api/Auth/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: this.editForm.fullName,
            phone: this.editForm.phone,
          }),
        });

        this.user.fullName = this.editForm.fullName;
        this.user.phone = this.editForm.phone;
        this.editMode = false;
        alert('Profile updated successfully!');
      } catch (err) {
        console.error('Profile update failed:', err);
        alert('Update failed.');
      }
    },
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
}
.profile-header img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.profile-info h2 {
  margin: 0;
  font-size: 24px;
}
.logout-button {
  margin-left: auto;
  background-color: crimson;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.edit-profile {
  margin-top: 30px;
}
.edit-profile form {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.edit-profile input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.edit-profile button {
  background-color: #1a73e8;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.orders {
  margin-top: 40px;
}
.order-card {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
}
.filter-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.filter-buttons button {
  padding: 6px 10px;
  cursor: pointer;
  background-color: #f1f1f1;
  border: none;
  border-radius: 4px;
}
.filter-buttons button:hover {
  background-color: #ddd;
}
</style>
