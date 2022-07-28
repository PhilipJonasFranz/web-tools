import Vue from 'vue';
import Vuetify, { VLayout } from 'vuetify/lib'

Vue.use(Vuetify, {
  components: {
    VLayout
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
