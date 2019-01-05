<template>
  <div>
    <div class="jumbotron bg-primary text-white text-center">
      <h2 class="lead display-3">#DEVCHAT#</h2>
      <p>Тестовый чат</p>
    </div>

    <!-- show loading status -->
    <div class="alert alert-info" v-if="loading">Processing...</div>

    <!-- show errors -->
    <div class="alert alert-danger" v-if="hasErrors">
      <div v-for="error in errors" :key="error">{{ error }}</div>
    </div>

    <div class="container-fluid">
      <div class="row mt-5">
        <div class="col text-center">
          <button class="btn btn-outline-danger btn-lg" @click="loginWithGoogle">Login with Google</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "firebase/auth";
import database from "firebase/database";
import { mapActions } from "vuex";

export default {
  name: "login",
  head: {
    title: {
      inner: "Login page",
      separator: "-",
      complement: "#DEVCHAT APP#"
    }
  },
  data() {
    return {
      errors: [],
      loading: false,
      usersRef: firebase.database().ref("users")
    };
  },
  computed: {
    hasErrors() {
      return this.errors.length > 0;
    }
  },
  methods: {
    ...mapActions(["setUser"]),
    // Аутентификация через Google
    async loginWithGoogle() {
      this.loading = true;
      this.errors = [];

      try {
        const response = await firebase
          .auth()
          .signInWithPopup(new firebase.auth.GoogleAuthProvider());

        // добавить данные о пользователе в БД
        await this.saveUserToUsersRef(response.user);

        await this.setUser(response.user);

        this.$router.push("/");
      } catch (err) {
        this.errors.push(err.message);
      }
      this.loading = false;
    },
    // Сохранение данных о пользователе в БД
    async saveUserToUsersRef(user) {
      return this.usersRef.child(user.uid).set({
        name: user.displayName,
        avatar: user.photoURL
      });
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
