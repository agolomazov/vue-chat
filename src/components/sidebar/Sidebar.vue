<template>
  <div>
    <h2 class="text-light">#DEVCHAT#</h2>
    <hr style="border: 1px solid #333;">
    <span>
      <img
        class="rounded-circle mr-2"
        height="30"
        :src="currentUser.photoURL"
        :alt="currentUser.displayName"
      >
      <span class="text-light">{{ currentUser.displayName }}</span>
    </span>
    <hr style="border: 1px solid #333;">
    <Channels/>
    <hr style="border: 1px solid #333;">
    <button class="btn btn-outline-light" @click="logout">Logout</button>
  </div>
</template>

<script>
import auth from "firebase/auth";
import { mapActions, mapGetters } from "vuex";

import Channels from "./Channels";

export default {
  name: "sidebar",
  computed: {
    ...mapGetters(["currentUser"])
  },
  methods: {
    ...mapActions(["setUser"]),
    async logout() {
      await firebase.auth().signOut();
      await this.setUser(null);
      this.$router.push("/login");
    }
  },
  components: {
    Channels
  }
};
</script>