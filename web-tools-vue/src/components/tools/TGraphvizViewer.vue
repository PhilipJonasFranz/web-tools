<template>
  <div>
    <p class="text-h4 mb-3">Graphviz Viewer</p>

    <v-card class="pa-3 mb-5">
      <p class="text-h5 mb-3">Usage</p>

      <ul class="mb-1">
        <li>Input a graph written in DOT in the textbox below.</li>
        <li>Configure the rendering engine and output format.</li>
        <li>If your syntax is valid, the rendered graph is displayed.</li>
        <li>The output can be saved in the currently selected format using the button below.</li>
      </ul>
    </v-card>

    <v-row class="mb-3">
      <v-col>
        <v-card height="100%" class="pa-5 pb-0">
          <v-textarea rows="16" class="custom-textarea" v-model="input" no-resize outlined name="dot-input"
            label="Grapviz DOT code" @keyup="refreshCanvas">
          </v-textarea>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="justify-center pa-5" height="100%">
          <div style="display: flex;">
            <p class="mr-2 pt-2">Engine: </p>
            <v-select :items="engines" v-on:change="refreshCanvas" v-model="selectedEngine" label="Solo field" dense solo></v-select>

            <p class="ml-4 mr-2 pt-2">Format: </p>
            <v-select :items="filetype" v-on:change="refreshCanvas" v-model="selectedFormat" label="Solo field" dense solo></v-select>

            <div class="ml-4 mt-1">
              <v-icon v-if="hadError" color="red" :class="{ 'animate__heartBeat animate__animated': animated }" @animationend="animated = false">
                mdi-close
              </v-icon>
              <v-icon v-else color="green" :class="{ 'animate__heartBeat animate__animated': animated }" @animationend="animated = false">
                mdi-check
              </v-icon>
            </div>
          </div>
          <div class="justify-center" style="display: flex;" ref="outputDiv"></div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="justify-center" style="display: flex;">
      <v-btn color="primary" class="ma-5" @click="saveRender">
        {{ "Save as " + selectedFormat }}
        <v-icon right>
          mdi-cloud-download
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

::v-deep .v-textarea textarea {
  font-family: monospace;
}
</style>

<script>
import 'animate.css';

import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';

export default {
  name: "TGraphvizViewer",
  data() {
    return {
      animated: false,

      /* Initial text-area input */
      input: 'digraph G {\n\ta -> b -> c;\n\tb -> d;\n}',

      /* Available rendering engines */
      engines: ['circo', 'dot', 'fdp', 'neato', 'osage', 'twopi'],
      selectedEngine: 'dot',

      /* Available output filetypes */
      filetype: ['SVG', 'PNG', 'JSON', 'XDOT', 'PLAIN', 'PS'],
      selectedFormat: 'SVG',

      /* Rendered output element */
      renderElement: undefined,

      isLoading: false,
      hadError: false,
    }
  },
  mounted() {
    this.refreshCanvas();
  },
  methods: {
    refreshCanvas() {
      let output = this.$refs.outputDiv;
      
      let setRenderCallback = element => {
        this.renderElement = element;
        this.isLoading = false;

        this.animated = true;
      };

      let hadErrorCallback = error => {
        console.log(error)

        this.isLoading = false;
        this.hadError = true;

        this.animated = true;
      }
      
      let viz = new Viz({ Module, render });
      
      this.hadError = false;
      this.isLoading = true;

      viz.renderSVGElement(this.input, { engine: this.selectedEngine, format: this.selectedFormat })
      .then(function(element) {
        output.innerHTML = '';
        output.appendChild(element);

        setRenderCallback(element)
      }).catch(error => {
        hadErrorCallback(error);
      });
    },
    saveRender() {
      if (this.renderElement) {
        // TODO: Figure out how to retrieve SVG element here
        let render = this.renderElement;

        console.log(render)

        const url = window.URL.createObjectURL(new Blob([render]));

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', "render." + this.selectedFormat.toLowerCase());

        document.body.appendChild(link);
        link.click();
      }
    }
  }
}
</script>