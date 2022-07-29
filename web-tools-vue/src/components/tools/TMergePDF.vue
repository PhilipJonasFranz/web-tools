<template>
  <div>
    <p class="text-h4 mb-3">Merge PDFs</p>

    <v-card class="pa-3 mb-5">
      <p class="text-h5 mb-3">Usage</p>

      <ul class="mb-1">
        <li>Select two or more PDF documents from the file list below.</li>
        <li>Adjust the order of the documents by dragging them into the correct order.</li>
        <li>Selected PDFs are merged in the configured order.</li>
      </ul>
    </v-card>

    <FileList class="mb-5" v-bind:selector=true></FileList>

    <div v-if="getSelectedUploads.length > 0">
      <p class="text-h4 mb-3">Adjust File Order</p>
      <v-card>
        <FileListDraggable class="mb-5"></FileListDraggable>
      </v-card>
    </div>

    <v-card class="justify-center" style="display: flex;">
      <v-btn color="primary" class="ma-5" :loading="isWaitingForServer" :disabled="!validate || isWaitingForServer" @click="sendRequest()">
        {{ 'Process ' + getSelectedUploads.length + ' document(s)' }}
        <v-icon right dark>
          mdi-cloud-upload
        </v-icon>
      </v-btn>
    </v-card>
  </div>
</template>

<script>
import { handleFileDownloadRequest } from '../../requestHandler'
import FileList from '../files/FileList.vue';
import FileListDraggable from '../files/FileListDraggable.vue';

export default {
  name: "TMergePDF",
  components: { FileList, FileListDraggable },
  computed: {
    getSelectedUploads() {
      return this.$store.state.settings.selectedUploads
    },
    validate() {
      return this.$store.state.settings.selectedUploads.length > 1;
    },
    isWaitingForServer() {
      return this.$store.state.waitingForServer;
    },
  },
  methods: {
    sendRequest() {
      handleFileDownloadRequest("document", "merge", [], this.getSelectedUploads, "merged.pdf")
    }
  }
}
</script>
