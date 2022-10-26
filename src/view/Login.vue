<template>
  <div class="login">
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from '@c/LoginForm'

export default {
  name: 'Login',
  data() {
    return {}
  },
  components: {
    LoginForm
  },
  methods: {}
}

</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url('../assets/images/login-bg.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}
</style>
