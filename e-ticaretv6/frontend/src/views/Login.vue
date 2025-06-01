<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>

      <button type="submit">Login</button>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <router-link to="/forgot-password" class="forgot-link">Forgot Password?</router-link>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = '';
      try {
        const response = await axios.post('https://localhost:7082/api/Auth/login', {
          email: this.email,
          password: this.password,
        });

        const token = response.data.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        this.$router.push('/');
      } catch (err) {
        this.errorMessage = 'Invalid email or password.';
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
}
h2 {
  text-align: center;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
.forgot-link {
  display: block;
  margin-top: 10px;
  text-align: center;
  color: #1a73e8;
  text-decoration: none;
}
</style>
