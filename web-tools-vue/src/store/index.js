import Vue from 'vue'
import Vuex from 'vuex'

import { tools } from "./tools"

Vue.use(Vuex)

function findToolByID(id) {
  let index = tools.findIndex(x => x.id === id);
  if (index != -1) return tools [index];
  else return null;
}

export default new Vuex.Store({
  state: {
    tags: ["PDF", "Image", "Conversion", "Media"],
    
    /* Cookie Settings */
    hasGivenCookieConsent: false,
    cookiesEnabled: false,
    
    /* Overall App State */
    waitingForServer: false,
    isEditingTools: false,
    
    /* Workspace Settings that are saved into cookies */
    settings: {
      /* Tool Settings */
      selectedTool: '',
      enabledTools: [],
      
      selectedTags: [],
      
      fileCounter: 0,
      selectedUploads: [],

      darkmode: false,
    },

    /* Tool request settings */
    toolRequestConfig: {
      color: '',
      similarity: 6,
    },

    /* File Management */
    uploadedFiles: [],
  },
  mutations: {
    loadDataFromCookies(state) {
      /* If cookie exists, cookie consent has been given prior */
      var settings = window.$cookies.get("web-tools-settings");

      if (settings) {
        /* Cookie exists, copy settings from cookie */
        state.hasGivenCookieConsent = true;
        state.cookiesEnabled = true;

        state.settings.selectedTags = settings.selectedTags;
        state.settings.enabledTools = settings.enabledTools;
        state.settings.selectedTool = settings.selectedTool;
        state.settings.fileCounter = settings.fileCounter;
        state.settings.darkmode = settings.darkmode;
      }
      else {
        /* Initialize default workspace */
        if (state.settings.enabledTools.length == 0) {
          let initialTools = ["merge-pdf", "rotate-pdf", "img-to-pdf", "graphviz-viewer", "mathjax-viewer", "img-transparency", "grayscale-img", "invert-img"]
          initialTools.forEach(x => {
            let tool = findToolByID(x);
            if (tool != null) state.settings.enabledTools.push(tool);
          })
        }

        console.log("Found no existing cookie, user cookie consent is required.")
      }
    },
    gaveCookieConsent(state, value) {
      /* Cookie consent has been given */
      state.hasGivenCookieConsent = true;
      state.cookiesEnabled = value;

      if (state.cookiesEnabled) {
        /* Since we enabled cookies, create initial cookies */
        window.$cookies.set("web-tools-settings", JSON.stringify(state.settings));
      }
      else {
        console.log("Deleting")

        /* Delete all remaining cookies */
        window.$cookies.remove("web-tools-settings");
      }
    },
    toggleDarkmode(state, value) {
      state.settings.darkmode = value;
      if (state.cookiesEnabled) window.$cookies.set("web-tools-settings", JSON.stringify(state.settings));
    },
    enableTool(state, tool) {
      state.settings.enabledTools.push(tool)
      if (state.cookiesEnabled) window.$cookies.set("web-tools-settings", JSON.stringify(state.settings));
    },
    disableTool(state, id) {
      state.settings.enabledTools = state.settings.enabledTools.filter(x => x.id !== id);
      if (state.cookiesEnabled) window.$cookies.set("web-tools-settings", JSON.stringify(state.settings));
    },
    setTool(state, id) {
        state.settings.selectedTool = id;
        if (state.cookiesEnabled) window.$cookies.set("web-tools-settings", JSON.stringify(state.settings));
    },
    setSimilarity(state, value) {
      state.toolRequestConfig.similarity = value;
    },
    setIsEditingTools(state, value) {
      state.isEditingTools = value;
    },
    setEnabledTools(state, value) {
      state.settings.enabledTools = value;
      if (state.cookiesEnabled) window.$cookies.set("web-tools-settings", JSON.stringify(state.settings));
    },
    setColor(state, value) {
      state.toolRequestConfig.color = value;
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
    },
    deleteFile(state, id) {
      state.settings.selectedUploads = state.settings.selectedUploads.filter(x => x.id !== id);
      state.uploadedFiles = state.uploadedFiles.filter(upload => upload.id !== id);
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
    }
  },
  actions: {

  },
  modules: {

  }
})