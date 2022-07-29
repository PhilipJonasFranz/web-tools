import Vue from 'vue';
import Vuetify, { VLayout, VRow } from 'vuetify/lib'

Vue.use(Vuetify, {
  /* Required to use these components as parents for draggables */
  components: {
    VLayout,
    VRow
  }
})

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#65968a'
      },
      dark: {
        primary: '#198391'
      },
    },
  },
});
