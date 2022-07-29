<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-btn icon @click="goHome()">
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-toolbar-title>Web Tools</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu bottom left offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <h3 class="ma-3">Settings</h3>
          <v-list-item>
            <v-list-item-title>Dark Mode</v-list-item-title>
            <v-switch v-model="darkmode" class="pl-6" inset @change="setDarkmode()">
            </v-switch>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Use Cookies</v-list-item-title>
            <v-switch v-model="cookies" class="pl-6" inset @change="setCookies()">
            </v-switch>
          </v-list-item>

          <v-list-item>
            <v-btn text rounded class="px-2 my-2" color="red accent-4" @click="deleteAllCookies">
              Clear all cookies
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-banner v-if="!hasGivenCookieConsent" single-line rounded outlined class="ma-4">
        <v-icon slot="icon" size="36">
          mdi-cookie-settings
        </v-icon>

        Enable cookies to persist settings and file-uploads between sessions?

        <template v-slot:actions>
          <v-btn text @click="allowCookies">
            Allow
          </v-btn>

          <v-btn color="red accent-4" text @click="disallowCookies">
            Reject
          </v-btn>
        </template>
      </v-banner>

      <v-container v-if="!hasToolSelected">
        <FileManager v-bind:showGetStartedCard=false></FileManager>
        <ToolExplorer class="mb-3" />
      </v-container>
      <v-container v-else>
        <ToolPane />
      </v-container>
    </v-main>

    <v-footer dark padless>
      <v-layout justify-center wrap>
        <v-row justify="center" no-gutters>
          <v-btn text rounded class="px-2 ma-2" href="https://github.com/PhilipJonasFranz/web-tools" target="_blank">
            GitHub project
            <v-icon class="pl-2">
              mdi-github
            </v-icon>
          </v-btn>
        </v-row>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<style scoped>
.v-application.theme--light {
  background: linear-gradient(20deg, #85C9C8, #dce5bb, #f4fae2);
}

.v-application.theme--dark {
  background: linear-gradient(-150deg, #036564, #033649);
}
</style>

<script>
import ToolExplorer from "./components/ToolExplorer.vue";
import ToolPane from "./components/ToolPane.vue";

import FileManager from "./components/files/FileManager.vue";

export default {
  name: 'App',
  components: {
    ToolExplorer,
    ToolPane,
    FileManager,
  },
  created() {
    this.$store.commit("loadDataFromCookies");
    this.$vuetify.theme.dark = this.$store.state.settings.darkmode;
    this.darkmode = this.$store.state.settings.darkmode;
    this.cookies = this.$store.state.cookiesEnabled;
  },
  data: () => ({
    group: null,
    darkmode: false,
    cookies: false,
  }),
  computed: {
    hasToolSelected() {
      return this.$store.state.settings.selectedTool;
    },
    hasGivenCookieConsent() {
      return this.$store.state.hasGivenCookieConsent;
    }
  },
  methods: {
    setDarkmode() {
      this.$vuetify.theme.dark = this.darkmode;
      this.$store.commit("toggleDarkmode", this.darkmode);
    },
    goHome() {
      this.$store.commit("clearSelection");
      this.$store.state.waitingForServer = false;
      this.$store.commit("setTool", '');
    },
    setCookies() {
      if (this.cookies) this.allowCookies();
      else this.disallowCookies();
      this.cookies = !this.cookies;
    },
    allowCookies() {
      this.cookies = true;
      this.$store.commit("gaveCookieConsent", true);
    },
    disallowCookies() {
      this.cookies = false;
      this.$store.commit("gaveCookieConsent", false);
    },
    deleteAllCookies() {
      window.$cookies.remove("web-tools-data");
      window.$cookies.remove("web-tools-settings");
    }
  }
};
</script>