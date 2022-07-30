<template>
    <div>
        <p class="text-h4 mb-3">Mathjax Viewer</p>

        <v-card class="pa-3 mb-5">
            <p class="text-h5 mb-3">Usage</p>

            <ul class="mb-1">
                <li>Input a latex formula in the text area below.</li>
                <li>If the formula is syntactially valid, it will be displayed in the box below.</li>
                <li>Use the Button below to save a rendered formula as svg file.</li>
            </ul>

            <h3 class="mt-3">Useful Links</h3>
            <ul>
                <li><a target="blank_" href="http://www.artofproblemsolving.com/wiki/index.php/LaTeX:Symbols">Symbols in
                        LaTeX</a></li>
                <li><a target="blank_" href="http://www.artofproblemsolving.com/wiki/index.php/LaTeX:Commands">Math Main
                        Functions</a></li>
            </ul>
        </v-card>

        <v-card class="mb-3 pa-5">
            <v-textarea v-model="formula" no-resize outlined name="formula-input" label="Latex Formula">
            </v-textarea>
        </v-card>

        <v-card class="mb-3 py-10">
            <vue-mathjax id="putty" :formula="getFormulaInput"></vue-mathjax>
        </v-card>

        <v-card class="justify-center" style="display: flex;">
            <v-btn color="primary" class="ma-5 mr-2" @click="saveAsSVG">
                Save as SVG
                <v-icon right>
                    mdi-cloud-download
                </v-icon>
            </v-btn>

            <v-btn color="primary" class="ma-5 ml-2" @click="saveAsPNG">
                Save as PNG
                <v-icon right>
                    mdi-cloud-download
                </v-icon>
            </v-btn>
        </v-card>
    </div>
</template>

<style scoped>
a {
    text-decoration: none;
}
</style>

<script>
import { VueMathjax } from 'vue-mathjax'
import domtoimage from 'dom-to-image';

export default {
    name: "TMathjaxViewer",
    components: {
        'vue-mathjax': VueMathjax
    },
    data () {
        return {
            formula: 'x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}'
        }
    },
    computed: {
        getFormulaInput() {
            return '$$' + this.formula + '$$';
        }
    },
    methods: {
        getMathElement() {
            /* 
             * I dont know a better way to do this, but what we try to do here is the following:
             * We want to select the HTML element on the page that contains the rendered formula.
             * Our top-level reference to this element is the 'putty' element. From here we have
             * to select: 'MathJax_Display > MathJax-Element-1-Frame > nobr > MathJax-Span-1'.
             * This selection path is implemented below.
             */
            return document.getElementById("putty").children [1].children [0].children [0].children [0];
        },
        saveAsSVG() { 
            var element = this.getMathElement();

            domtoimage.toSvg(element)
            .then(function (dataUrl) {
                var img = new Image();
                img.src = dataUrl;

                var link = document.createElement("a");

                document.body.appendChild(link); // for Firefox

                link.setAttribute("href", img.src);
                link.setAttribute("download", "formula.svg");
                link.click();
            })
            .catch(function (error) {
                console.error('Something went wrong!', error);
            });
        },
        saveAsPNG() { 
            var element = this.getMathElement();

            domtoimage.toPng(element)
            .then(function (dataUrl) {
                var img = new Image();
                img.src = dataUrl;

                var link = document.createElement("a");

                document.body.appendChild(link); // for Firefox

                link.setAttribute("href", img.src);
                link.setAttribute("download", "formula.png");
                link.click();
            })
            .catch(function (error) {
                console.error('Something went wrong!', error);
            });
        }
    }
}
</script>
