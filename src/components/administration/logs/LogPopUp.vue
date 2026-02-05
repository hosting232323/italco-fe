<template>
  <v-card
    :title="`Log id: ${log.id}`"
  >
    <pre class="json">
{{ formattedLog }}
    </pre>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useLogStore } from '@/stores/log';

const theme = useTheme();
const router = useRouter();
const logStore = useLogStore();
const { element: log } = storeToRefs(logStore);

const formattedLog = computed(() => {
  if (!log.value) return ''

  return JSON.stringify(
    {
      ...log.value,
      content: JSON.parse(log.value.content)
    },
    null,
    2
  )
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
