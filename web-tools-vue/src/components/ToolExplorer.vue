<template>
    <div>
        <div class="align-vertical">
            <p class="text-h4 mb-0">Available Tools</p>
            <v-btn v-if="isEditingTools" class="ml-2" icon @click="showDialog = true">
                <v-icon size="30">mdi-plus</v-icon>
            </v-btn>
            <v-btn class="ml-2" icon @click="isEditingTools = !isEditingTools">
                <v-icon v-if="isEditingTools" size="30">mdi-check</v-icon>
                <v-icon v-else size="25">mdi-pencil</v-icon>
            </v-btn>
        </div>

        <TagList class="mb-2" />

        <v-row v-if="!isOnMobile" class="pa-6">
            <draggable tag="v-row" v-model="enabledTools">
                <v-col v-for="tool in getToolSelection" :key="tool.id" class="pa-0 mr-5 mb-5">
                    <ToolDraggablePane v-bind:tool=tool></ToolDraggablePane>
                </v-col>
            </draggable>
        </v-row>
        <v-row v-else>
            <!-- Drag-an-drop re-ordering is currently not supported on mobile  -->
            <!-- as there are some weird bugs related to the layout, and the    -->
            <!-- fact that it almost becomes impossible to reliably scroll with -->
            <!-- with drag-and-drop enabled.                                    -->
            <v-col v-for="tool in getToolSelection" :key="tool.id">
                <ToolDraggablePane v-bind:tool=tool></ToolDraggablePane>
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
import draggable from "vuedraggable";
import TagList from "./TagList.vue";
import { tools } from "../store/tools"
import ToolDraggablePane from "./ToolDraggablePane.vue";

export default {
    name: 'ToolExplorer',
    components: { draggable, TagList, ToolDraggablePane },
    data: () => ({
        showDialog: false,
    }),
    computed: {
        isOnMobile() {
            return window.innerWidth < 600;
        },
        isEditingTools: {
            get() {
                return this.$store.state.isEditingTools;
            },
            set(val) {
                this.$store.commit("setIsEditingTools", val);
            }
        },
        enabledTools: {
            get() {
                return this.$store.state.settings.enabledTools;
            },
            set(val) {
                this.$store.commit("setEnabledTools", val);
            }
        },
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
        openAddToolDialog() {
            this.showDialog = true;
        }
    }
}
</script>
