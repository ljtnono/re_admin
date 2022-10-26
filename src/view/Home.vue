<template>
  <div class="container flex flex-direction-row">
    <Navigation :collapseStatus="collapseStatus"/>
    <Header/>
    <Main/>
  </div>
</template>

<script>
import Header from '@c/Header.vue';
import Navigation from '@c/Navigation.vue';
import Main from '@c/Main.vue'

export default {
  name: 'Home',
  data() {
    return {
      collapseStatus: false
    }
  },
  components: {
    Header,
    Navigation,
    Main
  },
  methods: {}
}
</script>


<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
