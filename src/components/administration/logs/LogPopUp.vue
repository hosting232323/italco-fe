<template>
  <v-card
    v-if="!loading"
    :title="`Log id: ${log.id}`"
  >
    <v-card-text>
      <h3 class="section-title">
        Request
      </h3>
      <pre class="json">
{{ formattedRequest }}
      </pre>

      <h3 class="section-title">
        Response
      </h3>
      <pre class="json">
{{ formattedResponse }}
      </pre>
    </v-card-text>
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

const formattedRequest = computed(() => {
  return JSON.stringify(JSON.parse(log.value.content).request, null, 2);
});

const formattedResponse = computed(() => {
  if (!log.value?.content) return '';

  const parsedContent = JSON.parse(log.value.content);

  const parsedResponse = deepParse(parsedContent.response);

  return JSON.stringify(parsedResponse, null, 2);
});

function deepParse(value) {
  if (typeof value === 'string') {
    try {
      return deepParse(JSON.parse(value));
    } catch {
      return value;
    }
  }

  if (Array.isArray(value))
    return value.map(deepParse);

  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, deepParse(v)])
    );

  return value;
}
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

.section-title {
  margin: 16px 0 8px;
  font-weight: 600;
  font-size: 14px;
  opacity: 0.8;
}
</style>
