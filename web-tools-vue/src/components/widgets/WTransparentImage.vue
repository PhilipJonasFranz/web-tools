<template>
  <div>
    <p class="text-h4 mb-3">Add Transparency to Image</p>

    <v-card class="pa-3 mb-5">
      <p class="text-h5 mb-3">Usage</p>

      <ul class="mb-1">
        <li>Select an image from the file list below.</li>
        <li>Select a color from the color picker or by clicking a color on the selected image.</li>
        <li>Configure a similarity value. The value determines how similar colors have to be to the base-color to be
          masked out.</li>
        <li>Pixels in the selected image matching the selected color are masked out.</li>
      </ul>
    </v-card>

    <div class="mb-5">
      <FileList v-bind:selector=true v-bind:allowMultiple=true></FileList>
    </div>

    <div v-if="getSelectedUploads.length > 0" class="mb-5">
      <p class="text-h4 mb-3">Select Color & Similarity</p>
      <v-row>
          <v-col>
            <v-card height="100%">
              <FileColorPicker class="pt-5"/>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="pa-5" height="100%">
              <v-color-picker v-model="color" hide-mode-switch></v-color-picker>
              <v-slider style="max-width: 600px;" track-color="secondary" v-model="similarity" label="Similarity"
                step="1" :max="100" class="align-center">
                <template v-slot:append>
                  <v-text-field v-model="similarity" type="number">
                  </v-text-field>
                </template>
              </v-slider>
            </v-card>
          </v-col>
        </v-row>
    </div>

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

<style scoped>
.center-card {
  align-items: center;
  justify-content: center;
}
</style>

<script>
import { handleFileRequest } from '../../requestHandler'
import FileList from '../files/FileList.vue';
import { HexToRGBA } from 'vuetify/lib/util/colorUtils';
import FileColorPicker from '../files/FileColorPicker.vue';

export default {
  name: "WTransparentImage",
  components: { FileList, FileColorPicker },
  data: () => ({
    types: ['hex', 'hexa', 'rgba', 'hsla', 'hsva'],
    type: 'hex',
    hex: '#FF00FF',
  }),
  computed: {
    validate() {
      return this.$store.state.settings.selectedUploads.length > 0;
    },
    getSelectedUploads() {
      return this.$store.state.settings.selectedUploads;
    },
    getConfiguredColor() {
      return this.$store.state.widgetRequestConfig.color;
    },
    getConfiguredSimilarity() {
      return this.$store.state.widgetRequestConfig.similarity;
    },
    isWaitingForServer() {
      return this.$store.state.waitingForServer;
    },
    color: {
      get() {
        return this.$store.state.widgetRequestConfig.color;
      },
      set(value) {
        this.$store.commit("setColor", value);
      },
    },
    similarity: {
      get() {
        return this.$store.state.widgetRequestConfig.similarity;
      },
      set(value) {
        this.$store.commit("setSimilarity", value);
      }
    },
    getSelectedFiles() {
      return this.$store.state.settings.selectedUploads;
    },
  },
  methods: {
    sendRequest() {
      var RGBA = HexToRGBA(this.getConfiguredColor);

      var options = [
        RGBA.r.toString(),
        RGBA.g.toString(),
        RGBA.b.toString(),
        this.getConfiguredSimilarity.toString()
      ];

      handleFileRequest("image", "transparency", options, this.getSelectedUploads);
    }
  }
}
</script>