<template>
  <v-form
    ref="form"
    @submit.prevent="submitForm"
  >
    <v-select
      label="Tipo"
      :items="[status]"
      :value="status.title"
    />
    <FormButtons
      :loading="loading"
      @cancel="emits('cancel')"
    />
  </v-form>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import { useRaeProductStore } from '@/stores/raeProduct';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const emits = defineEmits(['cancel']);
const status = orderUtils.RAE_STATUS.find(status => status.value == 'Disposed Off');

const raeProductStore = useRaeProductStore();
const { element: rae } = storeToRefs(raeProductStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;
  loading.value = true;

  rae.value.status = status.value;
  raeProductStore.updateElement(router, (data) => {
    loading.value = false;
    if (data.status == 'ok') {
      raeProductStore.initList(router);
      emits('cancel');
    }
  });
};
</script>
