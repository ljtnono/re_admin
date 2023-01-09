<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {

  }
};
</script>

<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  margin: 0;
  padding: 0;
}

body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

</style>
