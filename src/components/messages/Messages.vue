<template>
  <div class="messages-list">
    <message
      :message="message"
      v-for="message in messages"
      :key="message.timeStamp"
      :currentUser="currentUser"
    />
    <message-form
      @sendMessage="sendMessage"
      :currentChannel="currentChannel"
      :currentUser="currentUser"
      :errors="errors"
    />
  </div>
</template>

<script>
import Message from "./Message";
import MessageForm from "./MessageForm";
import database from "firebase/database";
import { mapGetters } from "vuex";

export default {
  name: "messages",
  data() {
    return {
      messagesRef: firebase.database().ref("messages"),
      errors: [],
      messages: [],
      channel: ""
    };
  },
  computed: {
    ...mapGetters(["currentChannel", "currentUser"])
  },
  watch: {
    currentChannel() {
      this.messages = [];
      this.addListeners();
      this.channel = this.currentChannel;
    }
  },
  methods: {
    async sendMessage(message) {
      try {
        await this.messagesRef
          .child(this.currentChannel.id)
          .push()
          .set(message)
          .then(() => {
            this.$nextTick(() => {
              window.scrollTo(0, document.documentElement.scrollHeight);
            });
          });
      } catch (error) {
        this.errors = [error.message];
      }
    },
    async addListeners() {
      this.messagesRef
        .child(this.currentChannel.id)
        .on("child_added", snapshot => {
          this.messages = [...this.messages, snapshot.val()];
          this.$nextTick(() => {
            window.scrollTo(0, document.documentElement.scrollHeight);
          });
        });
    },
    detachListeners() {
      if (this.channel !== null) {
        this.messagesRef.child(this.channel.id).off();
      }
    }
  },
  components: {
    message: Message,
    "message-form": MessageForm
  },
  beforeDestroy() {
    this.detachListeners();
  }
};
</script>

<style scoped>
.messages-list {
  padding-bottom: 65px;
}
</style>
