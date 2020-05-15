<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  beforeEnter: (to, from, next) => {
    console.log(to, 'about----------')
  }
}
</script>