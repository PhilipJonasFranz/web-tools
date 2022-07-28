<template>
    <img v-if="isImageFile" id="preview" class="mr-5" width="50" height="50" :src="buildURL(file)" />
    <v-icon v-else color="gray" class="mr-5" size="50">mdi-file-document</v-icon>
</template>

<style scoped>
#preview {
    border-radius: 8px;
}

img {
    object-fit: cover;
}
</style>

<script>
export default {
    name: 'FilePreview',
    props: ['file'],
    computed: {
        isImageFile() {
            return this.file && this.file.type.split('/')[0] === 'image';
        }
    },
    methods: {
        buildURL(file) {
            return URL.createObjectURL(file)
        }
    }
}
</script>
