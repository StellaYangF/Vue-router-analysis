<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
    <!-- <router-view name='profile'/>
    <router-view name='articles'/> -->

    <hr>
    <h3>button permission</h3>
    <button v-has='edit'>edit</button>
    <button v-has='dlt'>delete</button>
  </div>
</template>
<script>
export default {
  name: "app",
  beforeCreate() {
    // console.log('root');
  },
}
</script>
<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
</style>
