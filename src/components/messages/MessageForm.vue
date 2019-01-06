<template>
  <div>
    <div class="messageform">
      <form @submit.prevent="sendMessage" enctype="multipart/form-data">
        <div class="input-group mb-3">
          <input
            type="text"
            name="message"
            class="form-control mt-3"
            placeholder="Write something"
            autofocus
            @keypress.enter="sendMessage"
            v-model.trim="message"
          >

          <div class="input-group-append">
            <button type="submit" class="btn btn-primary mt-3" :disabled="!isValidForm">Send</button>
          </div>

          <div class="input-group-append">
            <button type="button" @click="selectFile" class="btn btn-warning mt-3">Upload</button>
          </div>
          <input type="file" name="file" ref="fileInput" class="hidden" @change="changeFile">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MessageForm",
  props: {
    currentChannel: {
      required: true
    },
    currentUser: {
      required: true
    },
    errors: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      message: "",
      file: null
    };
  },
  computed: {
    isValidForm() {
      return [this.currentChannel, this.message.length > 0].every(Boolean);
    }
  },
  methods: {
    sendMessage() {
      const newMessage = {
        content: this.message,
        timeStamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          name: this.currentUser.displayName,
          avatar: this.currentUser.photoURL,
          id: this.currentUser.uid
        }
      };

      if (this.isValidForm) {
        this.$emit("sendMessage", newMessage);
        this.message = "";
      }
    },
    selectFile() {
      this.$refs.fileInput.click();
    },
    changeFile(event) {
      this.$refs.fileInput.value = "";
    }
  }
};
</script>

<style scoped>
.messageform {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 67%;
  z-index: 100;
  color: #fff;
  text-align: center;
  margin: -16px;
  margin-left: 33.3%;
}

input,
button {
  height: 50px;
}

.hidden {
  display: none;
}
</style>
