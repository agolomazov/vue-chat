<template>
  <div>
    <div class="mt-3">
      <div class="media">
        <img
          :src="message.user.avatar"
          height="50"
          :alt="message.user.name"
          class="align-self-start mr-3"
        >

        <div class="media-body">
          <h6 class="mt-0">
            <a href="#">{{ message.user.name }}</a>
            - {{ message.timeStamp | fromNow }}
          </h6>
          <p
            :class="{
            'self_message': selfMessage(message.user)
          }"
          >{{ message.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { distanceInWords } from "date-fns";

export default {
  props: ["message", "currentUser"],
  name: "Message",
  filters: {
    fromNow(value) {
      return distanceInWords(Date.now(), value, {
        includeSeconds: true
      });
    }
  },
  methods: {
    selfMessage(user) {
      return this.currentUser.uid === user.id;
    }
  }
};
</script>

<style scoped>
.self_message {
  border-left: 5px solid red;
  padding: 0 10px;
}
</style>
