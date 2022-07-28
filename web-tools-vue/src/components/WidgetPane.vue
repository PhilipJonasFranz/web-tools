<template>
  <div>
    <div v-if="getSelectedWidget === 'grayscale-img'">
      <WGrayscaleImage />
    </div>
    <div v-else-if="getSelectedWidget === 'img-transparency'">
      <WTransparentImage />
    </div>
    <div v-else-if="getSelectedWidget === 'invert-img'">
      <WInvertImage />
    </div>
    <div v-else>
      <WMergePDF />
    </div>
  </div>
</template>

<script>
import WMergePDF from './widgets/WMergePDF.vue';

import WGrayscaleImage from './widgets/WGrayscaleImage.vue';
import WTransparentImage from './widgets/WTransparentImage.vue';
import WInvertImage from './widgets/WInvertImage.vue';

export default {
  name: "WidgetPane",
  components: {
    WMergePDF,
    WGrayscaleImage,
    WTransparentImage,
    WInvertImage
  },
  computed: {
    getSelectedWidget() {
      return this.$store.state.settings.selectedWidget;
    }
  }
}
</script>
