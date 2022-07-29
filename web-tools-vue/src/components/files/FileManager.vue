<template>
    <div>
        <div v-if="isOnMobile" class="mt-3"></div>
        <div v-else class="mt-15"></div>

        <div>
            <div style="position: relative;" class="d-flex pa-0">
                <div class="flex-column fill-height flex-grow-1"></div>
                <v-card absolute clipped right permanent @drop.prevent="onDrop($event)" @dragover.prevent="dragover = true"
                    @dragenter.prevent="dragover = true" @dragleave.prevent="dragover = false"
                    :class="{ 'grey lighten-2': dragover }" @click="openFileDialog">
                    <v-card-text>
                        <v-row class="d-flex flex-column" dense align="center" justify="center">
                            <v-icon :class="[dragover ? 'mt-2, mb-6' : 'mt-5']" size="60">
                                mdi-cloud-upload
                            </v-icon>
                            <p style="margin-left: 100px; margin-right: 100px;">Drop your file(s) here, or click to select
                                them.</p>
                        </v-row>

                        <v-virtual-scroll v-if="files.length > 0" :items="files" :height="Math.min(160, files.length * 65)"
                            item-height="50">
                            <template v-slot:default="{ item }">
                                <v-list-item :key="item.name">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ item.name }}
                                            <span v-if="item.size < 1000 * 1000" class="ml-3 text--secondary">
                                                {{ Math.round(item.size / 1000) }} KB</span>
                                            <span v-else class="ml-3 text--secondary">
                                                {{ Math.round(item.size / 10000) / 100 }} MB</span>
                                        </v-list-item-title>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <v-btn @click.stop="removeFile(item.name)" icon>
                                            <v-icon> mdi-close-circle </v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                            </template>
                        </v-virtual-scroll>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn icon :disabled="files.length == 0" @click.stop="uploadFiles">
                            <v-icon id="upload-button">mdi-upload</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
                <div class="flex-column fill-height flex-grow-1"></div>
            </div>

            <div v-if="getUploadedFiles.length > 0 || showGetStartedCard">
                <p class="text-h4 mb-3 mt-3">Your Files</p>
                <FileList class="mb-3" v-bind:file=true></FileList>
            </div>
        </div>

        <div v-if="isOnMobile" class="mb-5"></div>
        <div v-else class="mb-15"></div>
    </div>
</template>

<style scoped>
html {
    overflow-y: auto
}
</style>

<script>
import FileList from './FileList.vue';

export default {
    name: "FileManager",
    props: {
        showGetStartedCard: {
            default: true,
            type: Boolean,
        },
    },
    data: () => ({
        dragover: false,
        files: [],
        isUploading: false,
    }),
    computed: {
        getUploadedFiles() {
            return this.$store.state.uploadedFiles;
        },
        isOnMobile() {
            return window.innerWidth < 600;
        }
    },
    methods: {
        uploadFiles() {
            this.isUploading = true;

            this.files.forEach(file => {
                this.$store.commit("uploadFile", file);
            })

            this.isUploading = false;
            this.files = [];
        },
        removeFile(fileName) {
            const index = this.files.findIndex(file => file.name === fileName);
            if (index > -1) this.files.splice(index, 1);
        },
        onDrop(e) {
            this.dragover = false;
            for (var i = 0; i < e.dataTransfer.files.length; i++)
                this.files.push(e.dataTransfer.files[i]);
        },
        download(upload) {
            let url = URL.createObjectURL(upload.file);
            const a = document.createElement('a');
            a.href = url;
            a.download = upload.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        openFileDialog() {
            var input = document.createElement('input');
            input.type = 'file';

            input.onchange = e => {
                var file = e.target.files[0];
                this.files.push(file)
            }

            input.click();
        }
    },
    components: { FileList }
}
</script>

<style scoped>
.center-card {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>