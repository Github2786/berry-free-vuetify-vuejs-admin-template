<script setup lang="ts">
import { ref } from "vue";
import { SettingsIcon, LogoutIcon, UserIcon } from "vue-tabler-icons";
import { useAuthStore } from "@/stores/auth";

const swt1 = ref(true);
const swt2 = ref(false);
const authStore = useAuthStore();
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- profile DD -->
  <!-- ---------------------------------------------- -->
  <div class="pa-4">
    <h4 class="mb-n1">
      Hi
      <span class="font-weight-regular">{{
        authStore.user?.data?.name || `Guest user`
      }}</span>
    </h4>
    <span class="text-subtitle-2 text-medium-emphasis">{{
      authStore.user?.data?.usertype || `Guest user`
    }}</span>

    <v-divider></v-divider>
    <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 515px">
      <v-divider></v-divider>

      <v-list class="mt-3">
        <v-list-item color="secondary" rounded="md">
          <template v-slot:prepend>
            <SettingsIcon size="20" class="mr-2" />
          </template>

          <v-list-item-title class="text-subtitle-2"> Account Settings</v-list-item-title>
        </v-list-item>

        <v-list-item @click="authStore.logout()" color="secondary" rounded="md">
          <template v-slot:prepend>
            <LogoutIcon size="20" class="mr-2" />
          </template>

          <v-list-item-title class="text-subtitle-2"> Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </perfect-scrollbar>
  </div>
</template>
