<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-5"
  />
  <v-data-table
    v-else
    :items="logs"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Data', value: 'created_at', sortable: false },
      { title: 'Log', value: 'content', sortable: false }
    ]"
  >
  </v-data-table>
</template>

<script setup>
import { ref } from 'vue';
import { useTheme } from 'vuetify';

import http from '@/utils/http';
import { useRouter } from 'vue-router';

const logs = ref([]);
const ready = ref(false);
const theme = useTheme();
const router = useRouter();

http.getRequest('log', {}, (data) => {
  if(data.status == 'ok') {
    ready.value = true;
    logs.value = data.data;
  }
}, 'GET', router)
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}

.blur-password {
  filter: blur(6px);
}
</style>
