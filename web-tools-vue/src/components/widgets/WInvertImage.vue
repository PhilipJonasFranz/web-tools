<template>
  <div>
    <p class="text-h4 mb-3">Invert Image</p>

    <v-card class="pa-3 mb-5">
      <p class="text-h5 mb-3">Usage</p>

      <ul class="mb-1">
        <li>Select one or multiple images from the file list below.</li>
        <li>Selected images will be inverted.</li>
      </ul>
    </v-card>

    <FileList class="mb-5" v-bind:selector=true></FileList>

    <v-card class="justify-center" style="display: flex;">
      <v-btn color="primary" class="ma-5" :loading="isWaitingForServer" :disabled="!validate || isWaitingForServer" @click="sendRequest()">
        {{ 'Process ' + getSelectedUploads.length + ' Image(s)' }}
        <v-icon right dark>
          mdi-cloud-upload
        </v-icon>
      </v-btn>
    </v-card>
  </div>
</template>

<script>
import { handleFileRequest } from '../../requestHandler'
import FileList from '../files/FileList.vue';

export default {
  name: "WGrayscaleImage",
  components: { FileList },
  computed: {
    getSelectedUploads() {
      return this.$store.state.settings.selectedUploads
    },
    validate() {
      return this.$store.state.settings.selectedUploads.length > 0;
    },
    isWaitingForServer() {
      return this.$store.state.waitingForServer;
    },
  },
  methods: {
    sendRequest() {
      let selectedUploads = this.$store.state.settings.selectedUploads;
      handleFileRequest("image", "invert", [], selectedUploads);
    }
  }
}
</script>
