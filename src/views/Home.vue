<template>
  <div class="home">
    Home
  </div>
</template>

<script>

export default {
  name: 'home',
  beforeEnter: (to, from, next) => {
    console.log(to);
  }
}
</script>
