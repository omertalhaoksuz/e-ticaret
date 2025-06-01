<template>
  <div id="app">
    <Header :products="products" />

    <main class="main-content">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import axios from 'axios';

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      products: [],
    };
  },
  async created() {
    try {
      const response = await axios.get('https://localhost:7082/api/Product'); // PORT'u backend'e göre düzenle
      this.products = response.data;
    } catch (error) {
      console.error('Ürünler alınamadı:', error);
    }
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #fff;
  color: #333;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
}

</style>
