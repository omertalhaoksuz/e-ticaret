<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label>Full Name:</label>
        <input type="text" v-model="fullName" required />
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label>Password:</label>
        <input type="password" v-model="password" required />
      </div>

      <button type="submit">Register</button>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      fullName: '',
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleRegister() {
      this.errorMessage = '';
      try {
        const response = await axios.post('https://localhost:7082/api/Auth/register', {
          fullName: this.fullName,
          email: this.email,
          password: this.password,
          role: 'User', // kayıt olurken kullanıcı role'ü sabit
        });

        const token = response.data.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        this.$router.push('/');
      } catch (err) {
        this.errorMessage = 'Registration failed. Please check your inputs.';
      }
    },
  },
};
</script>

<style scoped>
.register-container {
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
  background-color: #28a745;
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
</style>
