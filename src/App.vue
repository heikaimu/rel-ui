<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.list-item {
  padding: 20px;
  background-color: #f2f2f2;
  margin-bottom: 10px;
  &.active {
    background-color: #111;
    color: #fff;
  }
}
</style>
