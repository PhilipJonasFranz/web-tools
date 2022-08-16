<template>
  <div>
    <p class="text-h4 mb-3">Rotate PDF</p>

    <v-card class="pa-3 mb-5">
      <p class="text-h5 mb-3">Usage</p>

      <ul class="mb-1">
        <li>Select a PDF document from the file list below.</li>
        <li>Configure the amount of degrees to rotate clockwise.</li>
        <li>The selected PDF is rotated clockwise by the configured amount.</li>
      </ul>
    </v-card>

    <FileList class="mb-5" v-bind:selector=true v-bind:allowMultiple=false></FileList>

    <div v-if="validate">
      <p class="text-h4 mb-3">Configure Rotation</p>

      <v-card class="justify-center mb-5 py-5" style="display: flex;">
        <p class="mt-3 mr-2">Rotate by degrees: </p>

        <v-btn-toggle
          v-model="rotation"
          mandatory
        >
          <v-btn>90</v-btn>
          <v-btn>180</v-btn>
          <v-btn>270</v-btn>
        </v-btn-toggle>
      </v-card>
    </div>

    <v-card class="justify-center" style="display: flex;">
      <v-btn color="primary" class="ma-5" :loading="isWaitingForServer" :disabled="!validate || isWaitingForServer" @click="sendRequest()">
        Rotate document
        <v-icon right dark>
          mdi-cloud-download
        </v-icon>
      </v-btn>
    </v-card>
  </div>
</template>

<script>
import { handleFileDownloadRequest } from '../../requestHandler'
import FileList from '../files/FileList.vue';

export default {
  name: "TMergePDF",
  components: { FileList },
  data() {
    return {
      rotation: undefined
    }
  },
  computed: {
    getSelectedUploads() {
      return this.$store.state.settings.selectedUploads
    },
    validate() {
      return this.$store.state.settings.selectedUploads.length == 1;
    },
    isWaitingForServer() {
      return this.$store.state.waitingForServer;
    },
  },
  methods: {
    sendRequest() {
      let rotations = ["90", "180", "270"];
      let selectedRotation = rotations[this.rotation] + "";
      handleFileDownloadRequest("document", "rotate", [selectedRotation], this.getSelectedUploads, "rotated.pdf")
    }
  }
}
</script>
