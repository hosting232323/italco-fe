<template>
  <v-card v-if="!schedule.order_ids" title="Seleziona degli ordini per creare un Borderò" />
  <v-card v-else-if="schedule.order_ids.some(
    id => orders.some(
      order => order.id === id && order.status !== 'Pending'
    )
  )" title="Hai selezionato degli ordini già assegnati" />
  <v-card v-else title="Crea Borderò" :subtitle="`Ordini: ${schedule.order_ids.join(', ')}`">
    <v-card-text>
      <v-form ref="form" @submit.prevent="assignDeliveryGroup">
        <v-row no-gutters>
          <v-col cols="12" md="4">
            <v-select v-model="schedule.delivery_group_id" :class="isMobile ? '' : 'mr-2'" label="Gruppo Delivery"
              :items="deliveryGroups" item-title="name" item-value="id" :rules="validation.requiredRules" />
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="schedule.transport_id" :class="isMobile ? '' : 'ml-2 mr-2'" label="Veicolo"
              :items="transports" item-title="name" item-value="id" :rules="validation.requiredRules" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field type="date" v-model="schedule.date" :class="isMobile ? '' : 'ml-2'" label="Data"
              :rules="validation.requiredRules" />
          </v-col>
        </v-row>


        <draggable v-model="selectedOrdersLocal" item-key="id" class="my-4" ghost-class="ghost" handle=".drag-handle"
          @end="onDragEnd">
          <template #item="{ element, index }">
            <div :class="['d-flex', isMobile? '' : 'align-center' , 'justify-space-between', 'draggable-item', isMobile ? 'flex-column' : '']" style="gap: 16px;">
              <div class="d-flex align-center" style="cursor: grab;">
                <v-icon small class="drag-handle" style="margin-right: 8px;">mdi-drag</v-icon>
                Ordine #{{ element.id }} - {{ element.address }}
              </div>
              <v-text-field v-if="!isMobile" type="date" v-model="selectedOrdersLocal[index].dates" label="Data ordine" :rules="validation.requiredRules" style="max-width: 170px;" dense hide-details />
              <v-text-field v-else type="date" v-model="selectedOrdersLocal[index].dates" label="Data ordine" :rules="validation.requiredRules" dense hide-details />
            </div>
          </template>
        </draggable>

        <FormButtons :loading="loading" @cancel="emits('cancel')" />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';
import FormButtons from '@/components/FormButtons';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';
import { useTransportStore } from '@/stores/transport';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';


const form = ref(null);
const router = useRouter();
const loading = ref(false);
const orderStore = useOrderStore();
const emits = defineEmits(['cancel']);
const scheduleStore = useScheduleStore();
const transportStore = useTransportStore();
const isMobile = mobile.setupMobileUtils();
const deliveryGroupStore = useDeliveryGroupStore();
const { element: schedule } = storeToRefs(scheduleStore);
const orders = storesUtils.getStoreList(orderStore, router);
const transports = storesUtils.getStoreList(transportStore, router);
const deliveryGroups = storesUtils.getStoreList(deliveryGroupStore, router);

const selectedOrdersLocal = ref([]);

const syncSelectedOrdersLocal = () => {
  if (!schedule.value.order_ids) {
    selectedOrdersLocal.value = [];
    return;
  }
  selectedOrdersLocal.value = schedule.value.order_ids.map(id => {
    const foundOrder = orders.value.find(o => o.id === id);
    return {
      ...foundOrder,
      date: foundOrder?.date || schedule.value.date || new Date().toISOString().substr(0, 10),
    };
  });
};

watch([orders, () => schedule.value.order_ids], () => {
  syncSelectedOrdersLocal();
}, { immediate: true });

const onDragEnd = () => {
  schedule.value.order_ids = selectedOrdersLocal.value.filter(o => o?.id).map(o => o.id);
};

const assignDeliveryGroup = async () => {
  if (!(await form.value.validate()).valid) return;

  schedule.value.order_ids = selectedOrdersLocal.value.map(o => o.id);
  schedule.value.date = selectedOrdersLocal.value[0]?.date || schedule.value.date;

  loading.value = true;
  scheduleStore.createElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      orderStore.initList(router);
      scheduleStore.initList(router);
      schedule.value = {};
      emits('cancel');
    }
  });
};
</script>

<style scoped>
.drag-handle {
  cursor: grab;
  user-select: none;
}

.ghost {
  opacity: 0.5;
  background-color: #e0e0e0;
  border-radius: 4px;
}

.draggable-item {
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

/* Rimuove il bordo dall'ultimo elemento per un look più pulito */
.draggable-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
</style>
