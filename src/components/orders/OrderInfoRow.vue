<template>
  <div style="display: flex; gap: 2px; width: 230px; align-items: center;">
    <v-btn
      size="small"
      variant="text"
      icon="mdi-circle"
      :loading="confirmLoading[item.id]"
      :color="item.confirmed ? 'green' : 'red'"
      @click="confirmOrder(item)"
    />
    <div>
      <b>ID:</b> {{ item.id }}
      <i v-if="Object.values(item.products).some(product => product.rae_product)">RAEE</i>
      <br>
      <v-tooltip
        v-if="item.external_id"
        location="top"
      >
        <template #activator="{ props }">
          <span
            v-bind="props"
            style="cursor: pointer;"
          >
            <b>Rif. Cliente:</b> [{{ item.external_id }}]<br>
          </span>
        </template>
        Data Conferma: {{ item.confirmation_date ? item.confirmation_date : 'N/A' }}
      </v-tooltip>
      <b>Tipo:</b> {{ orderUtils.TYPES.find(type => type.value == item.type)?.title }}<br>
      <div v-if="item.external_status">
        <b>Stato Esterno:</b>
        <span
          class="dot"
          :style="{backgroundColor: orderUtils.EXTERNAL_LABELS.find(label => label.value == item.external_status).color}"
        />
        {{ orderUtils.EXTERNAL_LABELS.find(label => label.value == item.external_status).title }}
      </div>
      <b style="margin-right: 5px;">Stato:</b>
      <v-chip
        :color="orderUtils.LABELS.find(label => label.value == item.status).color"
        style="font-size: 12px; height: 30px;"
        :style="{ cursor: role == 'Customer' ? 'default' : 'pointer' }"
        @click="role != 'Customer' && emits('open-statuses-popup', item)"
      >
        {{ orderUtils.LABELS.find(label => label.value == item.status).title }}
      </v-chip>
      <v-btn
        v-if="item.delay"
        title="Ordine in ritardo"
        icon="mdi-clock-alert-outline"
        variant="text"
        :color="theme.current.value.primaryColor"
      />
      <v-btn
        v-if="item.anomaly"
        title="Anomalia"
        icon="mdi-alert-outline"
        variant="text"
        :color="theme.current.value.primaryColor"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useRaeProductStore } from '@/stores/raeProduct';

const { item } = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const theme = useTheme();
const router = useRouter();
const confirmLoading = ref({});
const emits = defineEmits(['open-statuses-popup']);

const userStore = useUserStore();
const orderStore = useOrderStore();
const { role } = storeToRefs(userStore);
const raeProductStore = useRaeProductStore();

const confirmOrder = (order) => {
  confirmLoading.value[order.id] = true;
  http.postRequest(`order/${order.id}`, {
    order_id: order.id,
    confirmed: !order.confirmed
  }, (data) => {
    confirmLoading.value[order.id] = false;
    if (data.status == 'ok')
      orderStore.initList(router);
    raeProductStore.initList(router);
  }, 'PUT', router);
};
</script>

<style scoped>
.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-left: 5px;
}
</style>
