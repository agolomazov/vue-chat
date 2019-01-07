<template>
  <div>
    <button class="btn btn-outline-primary" @click="openModal">Add Channel</button>

    <!-- Список каналов  -->
    <div class="mt-4">
      <button
        v-for="channel in channels"
        class="list-group-item list-group-item-action"
        :key="channel.id"
        type="button"
        :class="{
          'active': setActiveChannel(channel)
        }"
        @click="changeChannel(channel)"
      >{{ channel.name }}</button>
    </div>

    <!-- Окно создания канала -->
    <div class="modal fade" ref="channelModal">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-dark">New Channel</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">&times;</button>
          </div>

          <div class="modal-body">
            <form>
              <div class="form-group">
                <input
                  type="text"
                  id="new_channel"
                  name="new_channel"
                  class="form-control"
                  placeholder="Channel name"
                  v-model="newChannel"
                >
              </div>
              <!-- errors -->
              <ul class="list-group" v-if="hasErrors">
                <li
                  class="list-group-item text-danger"
                  v-for="error in errors"
                  :key="error"
                >{{ error }}</li>
              </ul>
            </form>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="addChannel">Add Channel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import database from "firebase/database";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "channels",
  data() {
    return {
      newChannel: "",
      errors: [],
      channelsRef: firebase.database().ref("channels"),
      channels: [],
      channel: null
    };
  },
  computed: {
    ...mapGetters(["currentChannel"]),
    hasErrors() {
      return this.errors.length > 0;
    }
  },
  methods: {
    ...mapActions(["setCurrentChannel", "setPrivate"]),
    openModal() {
      $(this.$refs.channelModal)
        .appendTo("body")
        .modal("show");
    },
    async addChannel() {
      this.errors = [];
      const key = this.channelsRef.push().key;
      const newChannel = {
        id: key,
        name: this.newChannel
      };

      try {
        await this.channelsRef.child(key).update(newChannel);
        $(this.$refs.channelModal).modal("hide");
        this.newChannel = "";
      } catch (err) {
        this.errors = [err.message];
      }
    },
    addListeners() {
      // Получаем список каналов и новые каналы при добавлении
      this.channelsRef.on("child_added", snapshot => {
        this.channels.push(snapshot.val());

        if (this.channels.length > 0) {
          this.channel = this.channels[0];
          this.setCurrentChannel(this.channel);
        }
      });
    },
    detachListeners() {
      this.channelsRef.off();
    },
    setActiveChannel(channel) {
      return channel.id === this.currentChannel.id;
    },
    changeChannel(channel) {
      this.setPrivate();
      this.setCurrentChannel(channel);
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
