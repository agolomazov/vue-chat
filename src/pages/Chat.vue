<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4 sidebar">
          <Sidebar/>
        </div>

        <div class="col-md-8 content">
          <Messages/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/sidebar/Sidebar";
import Messages from "@/components/messages/Messages";
export default {
  name: "chat",
  head: {
    title: {
      inner: "Chat room",
      separator: "-",
      complement: "#DEVCHAT APP#"
    }
  },
  components: {
    Sidebar,
    Messages
  }
};
</script>

<style scoped>
.sidebar {
  width: 33.5%;
  display: block;
  float: left;
  position: fixed;
  height: 100%;
  background-color: #000;
  padding-top: 2em;
  overflow-x: hidden;
  overflow-y: auto;
}

.content {
  width: 66%;
  display: block;
  float: left;
  margin-left: 34%;
}
</style>
