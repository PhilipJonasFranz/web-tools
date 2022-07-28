import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tags: ["PDF", "Image", "Conversion", "Media"],
    hasGivenCookieConsent: false,
    cookiesEnabled: false,
    waitingForServer: false,
    settings: {
      selectedTags: [],
      selectedWidget: '',
      fileCounter: 0,

      selectedUploads: [],

      darkmode: false,
    },
    widgetRequestConfig: {
      color: '',
      similarity: 6,
    },
    uploadedFiles: []
  },
  mutations: {
    loadDataFromCookies(state) {
      /* If cookie exists, cookie consent has been given prior */
      var settings = window.$cookies.get("web-tools-settings");
      //var data = window.$cookies.get("web-tools-data");
      
      if (settings) {
        /* Cookie exists, copy settings from cookie */
        state.hasGivenCookieConsent = true;
        state.cookiesEnabled = true;

        state.settings.selectedTags = settings.selectedTags;
        state.settings.selectedWidget = settings.selectedWidget;
        state.settings.fileCounter = settings.fileCounter;
        state.settings.darkmode = settings.darkmode;
        
        /* Copy file uploads from cookie */
        // TODO: Need to encode files as base64 to save to cookie
        //state.uploadedFiles = data;
      }
      else {
        console.log("Found no existing cookie, user cookie consent is required.")
      }
    },
    gaveCookieConsent(state, value) {
      /* Cookie consent has been given */
      state.hasGivenCookieConsent = true;
      state.cookiesEnabled = value;

      if (state.cookiesEnabled) {
        /* Since we enabled cookies, create initial cookies */
        //window.$cookies.set("web-tools-data", JSON.stringify(state.uploadedFiles));
        window.$cookies.set("web-tools-settings", JSON.stringify(state.settings));
      }
      else {
        console.log("Deleting")

        /* Delete all remaining cookies */
        //window.$cookies.remove("web-tools-data");
        window.$cookies.remove("web-tools-settings");
      }
    },
    toggleDarkmode(state, value) {
      state.settings.darkmode = value;
      if (state.cookiesEnabled) window.$cookies.set("web-tools-settings", JSON.stringify(state.settings));
    },
    setWidget(state, id) {
        state.settings.selectedWidget = id;
        if (state.cookiesEnabled) window.$cookies.set("web-tools-settings", JSON.stringify(state.settings));
    },
    setSimilarity(state, value) {
      state.widgetRequestConfig.similarity = value;
    },
    setColor(state, value) {
      state.widgetRequestConfig.color = value;
    },
    selectTag(state, tag) {
        if (state.settings.selectedTags.includes(tag)) {
            const index = state.settings.selectedTags.indexOf(tag)
            if (index > -1) state.settings.selectedTags.splice(index, 1)
        }
        else {
            state.settings.selectedTags.push(tag)
        }

        if (state.cookiesEnabled) window.$cookies.set("web-tools-settings", JSON.stringify(state.settings));
    },
    setFileName(state, { id, replace }) {
      let uploads = state.uploadedFiles;
      for (let i = 0; i < uploads.length; i++) {
        if (uploads [i].id === id) {
          uploads [i].name = replace;
          return;
        }
      }
    },
    updateSelection(state, upload) {
      if (state.settings.selectedUploads.includes(upload)) {
        state.settings.selectedUploads = state.settings.selectedUploads.filter(x => x.id !== upload.id);
      }
      else {
        state.settings.selectedUploads.push(upload);
      }

      if (state.settings.selectedFileIndex >= state.settings.selectedUploads.length) {
        state.settings.selectedFileIndex = state.settings.selectedUploads.length - 1;
      }
    },
    clearSelection(state) {
      state.settings.selectedUploads = [];
    },
    setSelectedUploads(state, value) {
      state.settings.selectedUploads = value;
    },
    setAsSelected(state, upload) {
      let included = state.settings.selectedUploads.some(x => x.id === upload.id);

      state.settings.selectedUploads = [];
      if (!included) state.settings.selectedUploads.push(upload);
    },
    uploadFile(state, file) {
      let fileID = state.settings.fileCounter++;
      state.uploadedFiles.push({ id: fileID, name: file.name, file: file });
      //if (state.cookiesEnabled) window.$cookies.set("web-tools-data", JSON.stringify(state.uploadedFiles));
    },
    deleteFile(state, id) {
      state.settings.selectedUploads = state.settings.selectedUploads.filter(x => x.id !== id);
      state.uploadedFiles = state.uploadedFiles.filter(upload => upload.id !== id);
      //if (state.cookiesEnabled) window.$cookies.set("web-tools-data", JSON.stringify(state.uploadedFiles));
    },
    moveFileUp(state, id) {
      let uploads = state.uploadedFiles;
      for (let i = 1; i < uploads.length; i++) {
        if (uploads [i].id === id) {
          let temp = uploads [i - 1];

          Vue.set(state.uploadedFiles, i - 1, uploads [i]);
          Vue.set(state.uploadedFiles, i, temp);

          return;
        }
      }
      //if (state.cookiesEnabled) window.$cookies.set("web-tools-data", JSON.stringify(state.uploadedFiles));
    },
    moveFileDown(state, id) {
      let uploads = state.uploadedFiles;
      for (let i = 0; i < uploads.length - 1; i++) {
        if (uploads [i].id === id) {
          let temp = uploads [i + 1];
          
          Vue.set(state.uploadedFiles, i + 1, uploads [i]);
          Vue.set(state.uploadedFiles, i, temp);
          
          return;
        }
      }
      //if (state.cookiesEnabled) window.$cookies.set("web-tools-data", JSON.stringify(state.uploadedFiles));
    }
  },
  actions: {

  },
  modules: {

  }
})