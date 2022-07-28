<template>
    <div>
        <p class="text-h4 mb-3">Available Tools</p>
        <TagList />
        <div v-if="getWidgetSelection.length > 0">
            <v-row>
                <v-col v-for="widget in getWidgetSelection" :key="widget.id">
                    <v-hover v-slot="{ hover }">
                        <v-card height=120 :elevation="hover ? 8 : 2" @click="selectWidget(widget.id)">
                            <v-list-item three-line>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h5 mb-3">
                                        {{ widget.title }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="mb-4">{{ widget.description }}</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-avatar size="80">
                                    <v-icon size="60">
                                        {{ widget.icon }}
                                    </v-icon>
                                </v-list-item-avatar>
                            </v-list-item>
                        </v-card>
                    </v-hover>
                </v-col>
            </v-row>
        </div>
        <div v-else>
            <v-list-item-title class="text-h5 mb-3 text-center">
                <p>No widget available for the current selection.</p>
            </v-list-item-title>
        </div>
    </div>
</template>

<script>
import TagList from "./TagList.vue";
import { widgets } from "../store/widgets"

export default {
    name: 'WidgetExplorer',
    components: { TagList },
    computed: {
        getSelectedWidget() {
            return this.$store.state.settings.selectedWidget;
        },
        getWidgetSelection() {
            let selectedTags = this.$store.state.settings.selectedTags;
            if (selectedTags.length > 0) {
                let widgetSelection = [];

                widgets.forEach(widget => {
                    if (selectedTags.every(tag => {
                        return widget.tags.includes(tag);
                    })) {
                        widgetSelection.push(widget);
                    }
                });

                return widgetSelection;
            }
            else return widgets;
        }
    },
    methods: {
        selectWidget(widget) {
            this.$store.commit("setWidget", widget);
        }
    }
}
</script>
