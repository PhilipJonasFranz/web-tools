<template>
    <v-container>
        <v-layout class="justify-start fill-width">
            <div class="pa-5 pt-2">
                <v-layout />
                <draggable tag="v-layout" v-model="selectedUploads">
                    <div class="mr-5" v-for="upload in getSelectedUploads" :key="upload.id">
                        <FileDraggablePreview :upload="upload"></FileDraggablePreview>
                    </div>
                </draggable>
            </div>
        </v-layout>
    </v-container>
</template>

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
</style>

<script>
import draggable from "vuedraggable";
import FileDraggablePreview from "./FileDraggablePreview.vue";

export default {
    name: "FileListDraggable",
    components: {
        draggable,
        FileDraggablePreview
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
    computed: {
        getSelectedUploads() {
            return this.$store.state.settings.selectedUploads;
        },
        selectedUploads: {
            get() {
                return this.$store.state.settings.selectedUploads;
            },
            set(val) {
                this.$store.commit("setSelectedUploads", val);
            }
        },
    }
}
</script>