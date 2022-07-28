<template>
  <v-container>
    <v-chip v-for="tag in getTags" :tag-id="tag" :key="tag" class="mr-2"
      :color="getSelectedTags.includes(tag) ? 'primary' : 'surface'" @click="selectTag(tag)">
      {{ tag }}
    </v-chip>
  </v-container>
</template>

<script>
export default {
  name: 'TagList',
  computed: {
    getTags() {
      return this.$store.state.tags;
    },
    getSelectedTags() {
      return this.$store.state.settings.selectedTags;
    },
  },
  methods: {
    selectTag(tag) {
      this.$store.commit("selectTag", tag);
    },
  }
}
</script>
