<template>
  <div>
    <div v-if="getSelectedTool === 'grayscale-img'">
      <TGrayscaleImage />
    </div>
    <div v-else-if="getSelectedTool === 'img-transparency'">
      <TTransparentImage />
    </div>
    <div v-else-if="getSelectedTool === 'invert-img'">
      <TInvertImage />
    </div>
    <div v-else>
      <TMergePDF />
    </div>
  </div>
</template>

<script>
import TMergePDF from './tools/TMergePDF.vue';
import TGrayscaleImage from './tools/TGrayscaleImage.vue';
import TTransparentImage from './tools/TTransparentImage.vue';
import TInvertImage from './tools/TInvertImage.vue';

export default {
  name: "ToolPane",
  components: {
    TMergePDF,
    TGrayscaleImage,
    TTransparentImage,
    TInvertImage
  },
  computed: {
    getSelectedTool() {
      return this.$store.state.settings.selectedTool;
    }
  }
}
</script>
