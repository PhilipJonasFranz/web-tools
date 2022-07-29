<template>
    <v-hover v-slot="{ hover }">
        <v-card height=120 :elevation="hover ? 8 : 2" @click="!getIsEditingTools && selectTool(tool.id)">
            <v-list-item three-line>
                <v-list-item-content>
                    <v-list-item-title class="text-h5 mb-3">
                        {{ tool.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="mb-4">{{ tool.description }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar size="80">
                    <v-icon size="60">
                        {{ tool.icon }}
                    </v-icon>
                </v-list-item-avatar>
            </v-list-item>

            <v-fade-transition v-if="getIsEditingTools">
                <v-overlay v-if="hover || isOnMobile" absolute color="primary">
                    <v-btn @click="disableTool(tool.id)">Delete</v-btn>
                </v-overlay>
            </v-fade-transition>
        </v-card>
    </v-hover>
</template>

<script>
export default {
    name: "ToolDraggablePane",
    props: ['tool'],
    computed: {
        isOnMobile() {
            return window.innerWidth < 600;
        },
        getIsEditingTools() {
            return this.$store.state.isEditingTools;
        }
    },
    methods: {
        selectTool(id) {
            this.$store.commit("setTool", id);
        },
        disableTool(id) {
            this.$store.commit("disableTool", id);
        }
    }
};
</script>
