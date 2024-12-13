<template>
  <div id="app" :class="{ 'with-margin': $route.meta.marginTop }">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.with-margin {
  margin-top: 60px;
}

</style>

