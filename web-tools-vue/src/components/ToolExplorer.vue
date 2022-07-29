<template>
    <div>
        <div class="align-vertical">
            <p class="text-h4 mb-3">Available Tools</p>
            <v-btn class="ml-2" icon @click="editTools = !editTools">
                <v-icon v-if="editTools" size="30">mdi-check</v-icon>
                <v-icon v-else size="30">mdi-pencil</v-icon>
            </v-btn>
        </div>
        <TagList />
        <v-row>
            <v-col v-for="tool in getToolSelection" :key="tool.id">
                <v-hover v-slot="{ hover }">
                    <v-card height=120 :elevation="hover ? 8 : 2" @click="interactWithTool(tool.id)">
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
                    </v-card>
                </v-hover>
            </v-col>
            <v-col v-if="editTools">
                <v-hover v-slot="{ hover }">
                    <v-card class="center-card" height=120 :elevation="hover ? 8 : 2" @click="openAddToolDialog">
                        <v-list-item three-line>
                            <v-list-item-content>
                                <v-icon size="60">
                                    mdi-plus
                                </v-icon>
                                <p>
                                    Add additional tools
                                </p>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>

        <v-dialog v-model="showDialog" width="700">
            <v-card>
                <v-card-title class="text-h5">
                    Add more available tools
                </v-card-title>

                <v-list v-if="getDisabledTools.length > 0">
                    <v-list-item v-for="tool in getDisabledTools" :key="tool.id" class="mb-1">
                        <v-list-item-content>
                            <v-layout class="justify-start">
                                <v-icon size="30" class="mr-3">
                                    {{ tool.icon }}
                                </v-icon>

                                <v-list-item-title>
                                    {{ tool.title }}
                                    <v-list-item-subtitle>
                                        {{ tool.description }}
                                    </v-list-item-subtitle>
                                </v-list-item-title>
                            </v-layout>
                        </v-list-item-content>

                        <!-- For some reason the last button recieves unnessesary margin, manually set it with mx-0 -->
                        <v-list-item-action class="mx-0">
                            <v-btn icon @click="enableTool(tool)">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
                <div v-else class="py-3 center-card">
                    No additional tools available.
                </div>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="showDialog = false">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<style scoped>
.align-vertical {
    display: flex;
}

.center-card {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}
</style>

<script>
import TagList from "./TagList.vue";
import { tools } from "../store/tools"

export default {
    name: 'ToolExplorer',
    components: { TagList },
    data: () => ({
        editTools: false,
        showDialog: false,
    }),
    computed: {
        getSelectedTool() {
            return this.$store.state.settings.selectedTool;
        },
        getToolSelection() {
            let selectedTags = this.$store.state.settings.selectedTags;
            if (selectedTags.length > 0) {
                let toolSelection = [];

                this.getEnabledTools().forEach(tool => {
                    if (selectedTags.every(tag => {
                        return tool.tags.includes(tag);
                    })) {
                        toolSelection.push(tool);
                    }
                });

                return toolSelection;
            }
            else return this.getEnabledTools();
        },
        getDisabledTools() {
            let enabledTools = this.getEnabledTools();
            let disabledTools = [];
            tools.forEach(x => {
                if (enabledTools.findIndex(y => x.id === y.id) === -1) {
                    disabledTools.push(x);
                }
            })

            return disabledTools;
        }
    },
    methods: {
        getEnabledTools() {
            return this.$store.state.settings.enabledTools;
        },
        enableTool(tool) {
            this.$store.commit("enableTool", tool);
        },
        interactWithTool(id) {
            if (this.editTools) this.$store.commit("disableTool", id);
            else this.$store.commit("setTool", id);
        },
        openAddToolDialog() {
            this.showDialog = true;
        }
    }
}
</script>
