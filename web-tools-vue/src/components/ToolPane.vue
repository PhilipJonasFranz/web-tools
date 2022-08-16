<template>
  <div>
    <div v-if="getSelectedTool === 'graphviz-viewer'">
      <TGraphvizViewer/>
    </div>
    <div v-else-if="getSelectedTool === 'grayscale-img'">
      <TGrayscaleImage />
    </div>
    <div v-else-if="getSelectedTool === 'img-transparency'">
      <TTransparentImage />
    </div>
    <div v-else-if="getSelectedTool === 'invert-img'">
      <TInvertImage />
    </div>
    <div v-else-if="getSelectedTool === 'mathjax-viewer'">
      <TMathjaxViewer/>
    </div>
    <div v-else-if="getSelectedTool === 'rotate-pdf'">
      <TRotatePDF/>
    </div>
    <div v-else-if="getSelectedTool === 'img-to-pdf'">
      <TImageToPDF/>
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
import TMathjaxViewer from './tools/TMathjaxViewer.vue';
import TRotatePDF from './tools/TRotatePDF.vue';
import TImageToPDF from './tools/TImageToPDF.vue';
import TGraphvizViewer from './tools/TGraphvizViewer.vue';

export default {
  name: "ToolPane",
  components: {
    TMergePDF,
    TGrayscaleImage,
    TTransparentImage,
    TInvertImage,
    TMathjaxViewer,
    TRotatePDF,
    TImageToPDF,
    TGraphvizViewer
},
  computed: {
    getSelectedTool() {
      return this.$store.state.settings.selectedTool;
    }
  }
}
</script>
