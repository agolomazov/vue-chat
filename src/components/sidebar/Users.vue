<template>
  <div>
    <div class="text-light">
      <h4>Users</h4>

      <div class="mt-4">
        <button
          v-for="user in users"
          class="list-group-item list-group-item-action pointer"
          type="button"
          :class="{
            'active': isActive(user)
          }"
          @click.prevent="changeChannel(user)"
          :key="user.uid"
        >
          <span
            :class="{
              'fa fa-circle online': isOnline(user),
              'fa fa-circle offline': !isOnline(user)
            }"
          />&nbsp;&nbsp;&nbsp;
          <span>
            <img class="im rounded-circle" :src="user.avatar" height="20">
            <span :class="{
                'text-light': isActive(user)
              }">
              <a href="#">&nbsp;{{ user.name }}</a>
            </span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import database from "firebase/database";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "users",
  data() {
    return {
      users: [],
      usersRef: firebase.database().ref("users"),
      connectedRef: firebase.database().ref(".info/connected"),
      presenceRef: firebase.database().ref("presence")
    };
  },
  computed: {
    ...mapGetters(["currentUser", "currentChannel"])
  },
  methods: {
    ...mapActions(["setCurrentChannel", "setPrivate"]),
    addListeners() {
      this.usersRef.on("child_added", snapshot => {
        if (this.currentUser.uid !== snapshot.key) {
          let user = snapshot.val();
          user["uid"] = snapshot.key;
          user["status"] = "offline";
          this.users.push(user);
        }
      });

      this.presenceRef.on("child_added", snapshot => {
        if (this.currentUser.uid !== snapshot.key) {
          this.addStatusToUser(snapshot.key);
        }
      });

      this.presenceRef.on("child_removed", snapshot => {
        if (this.currentUser.uid !== snapshot.key) {
          this.addStatusToUser(snapshot.key, false);
        }
      });

      this.connectedRef.on("value", snapshot => {
        if (snapshot.val() === true) {
          let ref = this.presenceRef.child(this.currentUser.uid);
          ref.set(true);
          ref.onDisconnect().remove();
        }
      });
    },
    detachListeners() {
      this.usersRef.off();
      this.presenceRef.off();
      this.connectedRef.off();
    },
    addStatusToUser(userId, connected = true) {
      let index = this.users.findIndex(user => user.uid === userId);
      if (index !== -1) {
        connected
          ? (this.users[index].status = "online")
          : (this.users[index].status = "offline");
      }
    },
    isOnline(user) {
      return user.status === "online";
    },
    changeChannel(user) {
      let channelId = this.getChannelId(user.uid);
      let channel = { id: channelId, name: user.name };

      this.setPrivate(true);
      this.setCurrentChannel(channel);
    },
    getChannelId(userId) {
      return userId < this.currentUser.uid
        ? `${userId}/${this.currentUser.uid}`
        : `${this.currentUser.uid}/${userId}`;
    },
    isActive(user) {
      const channelId = this.getChannelId(user.uid);
      return this.currentChannel.id === channelId;
    }
  },
  mounted() {
    this.addListeners();
  },
  beforeDestroy() {
    this.detachListeners();
  }
};
</script>

<style scoped>
.online {
  color: green;
}
.offline {
  color: red;
}
.pointer {
  cursor: pointer;
}

.active a {
  color: white !important;
}
</style>
