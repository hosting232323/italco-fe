<template>
  <v-card
    v-if="!loading"
    :title="`Log id: ${log.id}`"
  >
    <pre class="json">
{{ formattedLog }}
    </pre>
  </v-card>
</template>

<script setup>
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useLogStore } from '@/stores/log';

const log = ref({});
const loading = ref(true);
const router = useRouter();
const logStore = useLogStore();
const { selectedLog } = storeToRefs(logStore);

http.getRequest('log', {
  log_id: selectedLog.value
}, (data) => {
  if(data.status == 'ok') {
    log.value = data.log;
    loading.value = false;
  }
}, 'GET', router);

const formattedLog = computed(() => {
  return JSON.stringify(JSON.parse(log.value.content), null, 2)
})
</script>

<style scoped>
.json {
  padding: 0 16px 16px 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  overflow-x: auto;
  max-height: 600px;
}
</style>
