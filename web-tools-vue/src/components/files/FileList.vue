<template>
    <div>
        <v-card v-if="getUploadedFiles.length > 0" style="padding: 2px;">
            <v-list>
                <v-list-item v-for="upload in getUploadedFiles" :key="upload.id" class="mb-1">
                    <v-checkbox v-if="selector" :input-value="getSelectedFiles.some(x => x.id === upload.id)"
                        class="pr-2" @click="toggleSelection(upload)">
                    </v-checkbox>

                    <FilePreview v-bind:file=upload.file></FilePreview>

                    <v-list-item-content>
                        <v-text-field v-if="getEditedFile === upload.id" v-model="replacement" type="text"
                            class="mt-2 mr-2">
                        </v-text-field>
                        <div v-else>
                            <v-list-item-title>
                                <v-chip class="px-1" x-small>
                                    {{ getFiletype(upload.file.name).toUpperCase() }}
                                </v-chip>
                                {{ getFilenameWithoutFileType(upload.name) }}
                            </v-list-item-title>

                            <v-list-item-subtitle v-if="upload.file.size < 1000 * 1000">
                                Size: {{ Math.round(upload.file.size / 1000) }} KB
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-else>
                                Size: {{ Math.round(upload.file.size / 10000) / 100 }} MB
                            </v-list-item-subtitle>
                        </div>
                    </v-list-item-content>

                    <v-list-item-action v-if="getEditedFile !== upload.id">
                        <v-btn icon @click="setEditedFile(upload)">
                            <v-icon color="gray">mdi-pencil</v-icon>
                        </v-btn>
                    </v-list-item-action>
                    <v-list-item-action v-else>
                        <v-btn icon @click="setNewFileName(upload)">
                            <v-icon color="gray">mdi-check-circle</v-icon>
                        </v-btn>
                    </v-list-item-action>

                    <v-list-item-action>
                        <v-btn icon @click="download(upload)">
                            <v-icon color="gray">mdi-download</v-icon>
                        </v-btn>
                    </v-list-item-action>

                    <!-- For some reason the last button recieves unnessesary margin, manually set it with mx-0 -->
                    <v-list-item-action class="mx-0">
                        <v-btn icon @click="removeFile(upload.id)">
                            <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>

        </v-card>
        <v-card v-else class="justify-center center-card" height="150px">
            <p class="text-h5 mb-3 ml-10">Upload a file to get started!</p>
        </v-card>
    </div>
</template>

<style scoped>
.center-card {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

<script>
import FilePreview from './FilePreview.vue';

export default {
    name: "FileList",
    components: {
        FilePreview
    },
    props: {
        selector: {
            default: false,
            type: Boolean,
        },
        allowMultiple: {
            default: true,
            type: Boolean,
        }
    },
    data: () => ({
        edited: -1,
        replacement: '',
    }),
    computed: {
        getEditedFile() {
            return this.edited;
        },
        getUploadedFiles() {
            return this.$store.state.uploadedFiles;
        },
        getSelectedFiles() {
            return this.$store.state.settings.selectedUploads;
        },
    },
    methods: {
        getFiletype(name) {
            let split = name.split('.');
            return split[split.length - 1];
        },
        getFilenameWithoutFileType(name) {
            return name.substring(0, name.length - this.getFiletype(name).length - 1)
        },
        toggleSelection(upload) {
            if (this.allowMultiple) this.$store.commit("updateSelection", upload);
            else this.$store.commit("setAsSelected", upload);
        },
        setEditedFile(upload) {
            this.edited = upload.id;
            this.replacement = upload.name;
        },
        setNewFileName(upload) {
            let id = upload.id;
            let replace = this.replacement.slice();

            this.$store.commit("setFileName", { id, replace });

            this.edited = -1;
            this.replacement = '';
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
        removeFile(id) {
            this.$store.commit("deleteFile", id);
        },
        switchFileUp(id) {
            this.$store.commit("moveFileUp", id);
        },
        switchFileDown(id) {
            this.$store.commit("moveFileDown", id);
        }
    }
}
</script>