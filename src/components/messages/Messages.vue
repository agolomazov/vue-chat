<template>
  <div>
    <h2>{{ channelName }}</h2>
    <div class="messages-list">
      <message
        :message="message"
        v-for="message in messages"
        :key="message.timeStamp"
        :currentUser="currentUser"
      />

      <!-- File upload progress bar -->
      <div class="progress">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          ref="progressBar"
        >upload</div>
      </div>
      <message-form
        @sendMessage="sendMessage"
        @uploadFile="uploadFile"
        :currentChannel="currentChannel"
        :currentUser="currentUser"
        :errors="errors"
      />
    </div>
  </div>
</template>

<script>
import Message from "./Message";
import MessageForm from "./MessageForm";
import database from "firebase/database";
import storage from "firebase/storage";
import { mapGetters } from "vuex";
import uuidv4 from "uuid/v4";

export default {
  name: "messages",
  data() {
    return {
      messagesRef: firebase.database().ref("messages"),
      privateMessagesRef: firebase.database().ref("privateMessages"),
      storageRef: firebase.storage().ref(),
      errors: [],
      messages: [],
      channel: null,
      listeners: [],
      uploadTask: null,
      uploadState: null
    };
  },
  computed: {
    ...mapGetters(["currentChannel", "currentUser", "isPrivate"]),
    channelName() {
      if (this.channel !== null) {
        return this.isPrivate
          ? `@ ${this.channel.name}`
          : `# ${this.channel.name}`;
      }

      return null;
    }
  },
  watch: {
    currentChannel() {
      this.detachListeners();
      this.addListeners();
      this.channel = this.currentChannel;
    }
  },
  methods: {
    async sendMessage(message) {
      try {
        const ref = this.getMessagesRef();
        await ref
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
      const ref = this.getMessagesRef();
      ref.child(this.currentChannel.id).on("child_added", snapshot => {
        const message = snapshot.val();
        message["id"] = snapshot.key;
        this.messages = [...this.messages, message];
        this.$nextTick(() => {
          window.scrollTo(0, document.documentElement.scrollHeight);
        });
      });

      this.addToListeners(this.currentChannel.id, ref, "child_added");
    },
    addToListeners(id, ref, event) {
      const index = this.listeners.findIndex(el => {
        return el.id === id && el.ref === ref && el.event === event;
      });

      if (index === -1) {
        this.listeners.push({
          id,
          ref,
          event
        });
      }
    },
    detachListeners() {
      this.listeners.forEach(listener => {
        listener.ref.child(listener.id).off(listener.event);
      });

      this.listeners = [];
      this.messages = [];
    },
    getMessagesRef() {
      if (this.isPrivate) {
        return this.privateMessagesRef;
      } else {
        return this.messagesRef;
      }
    },
    async uploadFile(payload) {
      const { file, metadata } = payload;
      if (file === null) return;

      const pathToUpload = this.currentChannel.id;
      const ref = this.getMessagesRef();
      const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

      this.uploadTask = this.storageRef.child(filePath).put(file, metadata);
      this.uploadState = "uploading";

      // on upload state change
      this.uploadTask.on(
        "state_changed",
        snapshot => {
          // on change file upload
          const percent =
            (snapshot.bytesTransfered / snapshot.totalBytes) * 100;
          this.$refs.progressBar.style.width = `${percent}%`;
        },
        error => {},
        () => {
          // upload finished
        }
      );
    },
    getPath() {
      if (this.isPrivate) {
        return `chat/private/${this.currentChannel.id}`;
      } else {
        return "chat/public";
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

.progress {
  margin-bottom: -16px;
}
</style>
