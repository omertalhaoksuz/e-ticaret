<template>
  <div class="color-manager">
    <h2>Manage Colors</h2>

    <!-- Renk Ekle -->
    <form @submit.prevent="addColor" class="add-form">
      <input v-model="newColor" placeholder="New color name" required />
      <button type="submit">Add</button>
    </form>

    <!-- Renk Listesi -->
    <ul class="color-list">
      <li v-for="color in colors" :key="color.id">
        {{ color.name }}
        <button @click="deleteColor(color.id)">❌</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      colors: [],
      newColor: '',
    };
  },
  async mounted() {
    await this.fetchColors();
  },
  methods: {
    async fetchColors() {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://localhost:7082/api/Color', {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.colors = res.data;
    },
    async addColor() {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.post(
          'https://localhost:7082/api/Color',
          { name: this.newColor },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.colors.push(res.data);
        this.newColor = '';
      } catch (err) {
        console.error('Renk eklenemedi:', err);
      }
    },
    async deleteColor(id) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`https://localhost:7082/api/Color/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.colors = this.colors.filter((c) => c.id !== id);
      } catch (err) {
        console.error('Silme işlemi başarısız:', err);
      }
    },
  },
};
</script>

<style scoped>
.color-manager {
  max-width: 600px;
  margin: 0 auto;
}
.add-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
input {
  flex: 1;
  padding: 8px;
}
button {
  padding: 8px 12px;
}
.color-list {
  list-style: none;
  padding: 0;
}
.color-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}
</style>
