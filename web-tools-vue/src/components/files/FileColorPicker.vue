<template>
    <div class="pt-2">
        <div class="container_row">
            <canvas class="img_layer" ref="canvasElement" @click="selectCurrentColor"></canvas>

            <v-card v-if="isTracking" class="center-card speech-bubble txt_layer"
                :style="{ left: (cursorX - 120) + 'px', top: (cursorY - (imgHeight / 2) - 30) + 'px' }"
                ref="dataReadoutEl">
                <v-icon class="pr-2" :color="getCurrentColorHexCode">
                    mdi-square-rounded
                </v-icon>

                {{ 'R: ' + currentColor.r + ', G: ' + currentColor.g + ', B: ' + currentColor.b }}

                <v-icon :v-if="animated || (cCX == cursorX && cCY == cursorY)" style="margin-left: 5px"
                    :class="{ 'animate__heartBeat animate__animated': animated }" @animationend="animated = false">
                    mdi-check
                </v-icon>
            </v-card>
        </div>
        <v-container class="mt-1">
            <v-layout class="justify-start fill-width">
                <v-flex v-for="upload in getSelectedUploads" :key="upload.id">
                    <img id="preview" class="mr-1" height="100" style="border-radius: 8px;" :src="buildURL(upload.file)"
                        @click="setIndex(upload)" />
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import 'animate.css';

export default {
    name: "FileColorPicker",
    data: () => ({
        selectedFileIndex: 0,

        canvasMaxSize: 400,

        isTracking: false,
        animated: false,

        cursorX: 0,
        cursorY: 0,

        thumbPos: { x: 0, y: 0 },

        /* Width and height of the seleted image on canvas */
        imgWidth: 0,
        imgHeight: 0,

        /* The current color */
        currentColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 255,
        },

        cCX: 0,
        cCY: 0,
    }),
    mounted() {
        this.refreshCanvas();

        this.$nextTick(function () {
            this.$refs.canvasElement.addEventListener("mousemove", this.updatePosition);
            this.$refs.canvasElement.addEventListener("mouseleave", this.stopTracking);
        });
    },
    computed: {
        color: {
            get() {
                return this.$store.state.toolRequestConfig.color;
            },
            set(value) {
                this.$store.commit("setColor", value);
            },
        },
        getCurrentColorHexCode() {
            return this.RGBtoHEX(this.currentColor);
        },
        getSelectedUploads() {
            return this.$store.state.settings.selectedUploads;
        }
    },
    methods: {
        getCanvasMaxSize() {
            return Math.min(window.innerWidth - 100, this.canvasMaxSize);
        },
        async refreshCanvas() {
            const image = new Image();
            image.src = this.buildURL(this.getSelectedFile());

            image.onload = () => {
                this.imgWidth = Math.min(this.getCanvasMaxSize() * image.width / image.height, this.getCanvasMaxSize());
                this.imgHeight = Math.min(this.getCanvasMaxSize() * image.height / image.width, this.getCanvasMaxSize());
            };

            await image.decode();

            let canvas = this.$refs.canvasElement;

            canvas.width = this.imgWidth;
            canvas.height = this.imgHeight;

            let ctx = canvas.getContext("2d");

            console.log(image)

            ctx.drawImage(image, 0, 0, this.imgWidth, this.imgHeight);
        },
        setIndex(upload) {
            let index = this.getSelectedUploads.indexOf(upload);
            if (index != -1) {
                this.selectedFileIndex = index;
                this.refreshCanvas();
            }
        },
        getSelectedFile() {
            return this.$store.state.settings.selectedUploads[this.selectedFileIndex].file;
        },
        RGBtoHEX(color) {
            const toHex = v => {
                const h = Math.round(v).toString(16);
                return ("00".substr(0, 2 - h.length) + h).toUpperCase();
            };
            return `#${[toHex(color.r), toHex(color.g), toHex(color.b)].join("")}`;
        },
        buildURL(file) {
            return URL.createObjectURL(file);
        },
        selectCurrentColor() {
            this.color = this.RGBtoHEX(this.currentColor);
            /* Start the check icon animation */
            this.animated = true;
            /* cCX, cCY hold position of last 'click' */
            this.cCX = this.cursorX;
            this.cCY = this.cursorY;
        },
        updatePosition(e) {
            this.isTracking = true;

            this.getBounds();
            this.getCursorPos(e);

            let canvas = this.$refs.canvasElement;
            var context = canvas.getContext("2d");

            var canvasColor = context.getImageData(this.cursorX, this.cursorY, 1, 1).data;

            this.currentColor.r = canvasColor[0];
            this.currentColor.g = canvasColor[1];
            this.currentColor.b = canvasColor[2];
        },
        stopTracking() {
            this.isTracking = false;
        },
        getCursorPos(e) {
            let x = window.Event
                ? e.pageX
                : e.clientX;
            x -= (document.documentElement.scrollLeft) ?
                document.documentElement.scrollLeft
                : document.body.scrollLeft;
            let y = window.Event
                ? e.pageY
                : e.clientY;
            y -= (document.documentElement.scrollTop) ?
                document.documentElement.scrollTop
                : document.body.scrollTop;
            this.cursorX = x - this.thumbPos.x;
            this.cursorY = y - this.thumbPos.y;
        },
        getBounds() {
            let el = this.$refs.canvasElement;
            this.bounds = el.getBoundingClientRect();
            let xPos = 0;
            let yPos = 0;
            while (el) {
                const transform = this.getTransform(el);
                if (el.tagName === "BODY") {
                    // deal with browser quirks with body/window/document and page scroll
                    const xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                    const yScroll = el.scrollTop || document.documentElement.scrollTop;
                    xPos += el.offsetLeft - xScroll + el.clientLeft + parseInt(transform[0]);
                    yPos += el.offsetTop - yScroll + el.clientTop + parseInt(transform[1]);
                }
                else {
                    // for all other non-BODY elements
                    xPos += el.offsetLeft - el.scrollLeft + el.clientLeft + parseInt(transform[0]);
                    yPos += el.offsetTop - el.scrollTop + el.clientTop + parseInt(transform[1]);
                }
                el = el.offsetParent;
            }
            this.thumbPos = {
                x: xPos,
                y: yPos,
            };
        },
        getTransform(el) {
            const transform = window
                .getComputedStyle(el, null)
                .getPropertyValue("-webkit-transform");
            function rotateDegree(matrix) {
                let angle;
                if (matrix !== "none") {
                    const values = matrix
                        .split("(")[1]
                        .split(")")[0]
                        .split(",");
                    const a = values[0];
                    const b = values[1];
                    angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
                }
                else {
                    angle = 0;
                }
                // eslint-disable-next-line no-return-assign
                return angle < 0 ? (angle += 360) : angle;
            }
            const results = transform.match(/matrix(?:(3d)\(-{0,1}\d+\.?\d*(?:, -{0,1}\d+\.?\d*)*(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*)), -{0,1}\d+\.?\d*\)|\(-{0,1}\d+\.?\d*(?:, -{0,1}\d+\.?\d*)*(?:, (-{0,1}\d+\.?\d*))(?:, (-{0,1}\d+\.?\d*))\))/);
            let output = [0, 0, 0];
            if (results) {
                if (results[1] === "3d") {
                    output = results.slice(2, 5);
                }
                else {
                    results.push(0);
                    output = results.slice(5, 9); // returns the [X,Y,Z,1] value;
                }
                output.push(rotateDegree(transform));
            }
            return output;
        },
    }
};
</script>

<style scoped>
.fill-width {
    overflow-x: auto;
    flex-wrap: nowrap;
}

.center-card {
    display: flex;
    align-items: center;
    justify-content: center;
}

.speech-bubble {
    min-width: 240px !important;
    width: 240px;
}

.speech-bubble:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    border: 13px solid transparent;
    border-top-color: inherit;
    border-bottom: 0;
    margin-left: -13px;
    margin-bottom: -8px;
}

.container_row {
    display: grid;
    align-items: center;
    justify-content: center;
}

.img_layer,
.txt_layer {
    grid-column: 1;
    grid-row: 1;
}

.img_layer {
    border-radius: 5px;
}

.txt_layer {
    width: max-content;
    padding: 5px;
    display: absolute;
}
</style>