<script setup lang="ts">
import { defineAsyncComponent } from "vue";

import ChatComingSoonPage from "./ChatComingSoonPage.vue";
import { RemoteChatPage } from "../remotes";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const RemoteChatPageComponent = defineAsyncComponent(RemoteChatPage);
</script>

<template>
  <ChatComingSoonPage v-if="authStore.isGuest" />
  <RemoteChatPageComponent v-else />
</template>
