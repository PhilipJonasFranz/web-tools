<template>
    <v-card class="center-card" elevation=5>
        <img v-if="isImageFile" width="100" height="100" :src="buildURL" />
        <div v-else style="height: 100px; width: 150px">
            <v-icon class="py-2" size="60">mdi-file-document</v-icon>
            <p class="px-3">{{ upload.name }}</p>
        </div>
    </v-card>
</template>

<style scoped>
.center-card {
    text-align: center;
    overflow: hidden;
}

p {
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

img {
    object-fit: cover;
}
</style>

<script>
export default {
    name: "FileDraggablePreview",
    props: ['upload'],
    computed: {
        isImageFile() {
            return this.upload.file && this.upload.file.type.split('/')[0] === 'image';
        },
        buildURL() {
            return URL.createObjectURL(this.upload.file)
        }
    }
};
</script>
