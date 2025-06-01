<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="social-icons">
        <a href="https://twitter.com" target="_blank">Twitter</a>
        <a href="https://facebook.com" target="_blank">Facebook</a>
        <a href="https://instagram.com" target="_blank">Instagram</a>
        <a href="https://linkedin.com" target="_blank">LinkedIn</a>
      </div>
      <div class="contact-info">
        <p>Email: support@3dprintstore.com</p>
        <p>Phone: +90 555 123 4567</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped>
.footer {
  background-color: #f2f2f2;
  padding: 20px;
  font-size: 14px;
  color: #555;
}
.footer-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.social-icons {
  display: flex;
  gap: 15px;
}
.social-icons a {
  text-decoration: none;
  color: #007bff;
}
.social-icons a:hover {
  text-decoration: underline;
}
.contact-info {
  text-align: center;
}
.footer-bottom {
  text-align: center;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
</style>
