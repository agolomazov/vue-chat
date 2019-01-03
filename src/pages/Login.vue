<template>
  <div>
    <div class="jumbotron bg-primary text-white text-center">
      <h2 class="lead display-3">#DEVCHAT#</h2>
      <p>Тестовый чат</p>
    </div>
    <div class="container-fluid">
      <div class="row mt-5">
        <div class="col text-center">
          <button class="btn btn-outline-danger btn-lg">Login with Google</button>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col text-center">
          <button class="btn btn-outline-info btn-lg" @click="helloHandler">Login with Twitter</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  methods: {
    helloHandler(event) {
      console.log("Hello, handler click");
    }
  }
};
</script>

<style lang="scss">
.btn,
.jumbotron {
  border-radius: 0 !important;
}
</style>
