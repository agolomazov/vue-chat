<template>
  <!-- Окно загрузки файла -->
  <div class="modal fade">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-dark">Upload Image (jpeg, png - 1mb max)</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">&times;</button>
        </div>

        <div class="modal-body">
          <form>
            <div class="form-group">
              <input
                type="file"
                id="file"
                name="file"
                class="form-control"
                placeholder="Choice file"
                @change="addFile"
                ref="fileInput"
              >
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="uploadFile">Upload file</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "file-modal",
  data() {
    return {
      fileData: null
    };
  },
  methods: {
    addFile(e) {
      console.log("add file");
    },
    uploadFile() {
      console.log("upload file");
    }
  }
};
</script>
