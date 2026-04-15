<template>
  <v-row no-gutters>
    <v-col
      cols="12"
      :md="filtersSetting.doubleDates ? 4: 6"
    >
      <v-text-field
        v-model="filters[`${dateFilterTypes[filtersSetting.dateType].entity}.${filtersSetting.dateType}`][0]"
        :class="isMobile ? '' : 'mr-2'"
        :label="dateFilterTypes[filtersSetting.dateType].label"
        type="date"
        clearable
        :prepend-icon="filtersSetting.doubleDates ? 'mdi-minus' : 'mdi-plus'"
        @click:prepend="updateDoubleDates"
      />
    </v-col>
    <v-col
      v-if="filtersSetting.doubleDates"
      cols="12"
      md="4"
    >
      <v-text-field
        v-model="filters[`${dateFilterTypes[filtersSetting.dateType].entity}.${filtersSetting.dateType}`][1]"
        :class="isMobile ? '' : 'ml-2 mr-2'"
        label="Data di fine intervallo"
        type="date"
        :rules="validation.futureDate(filters[`${dateFilterTypes[filtersSetting.dateType].entity}.${filtersSetting.dateType}`][0])"
        clearable
      />
    </v-col>
    <v-col
      cols="12"
      :md="filtersSetting.doubleDates ? 4: 6"
    >
      <v-select
        v-model="filtersSetting.dateType"
        label="Tipo di Data"
        :class="isMobile ? '' : 'ml-2'"
        :disabled="Object.keys(dateFilterTypes).length == 1"
        :items="Object.entries(dateFilterTypes).map(([key, value]) => ({value: key, title: value.label}))"
        @update:model-value="updateDateType"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useLogStore } from '@/stores/log';
import validation from '@/utils/validation';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';
import { useRaeProductStore } from '@/stores/raeProduct';

const { filterTypes, element } = defineProps({
  element: {
    type: String,
    required: true
  },
  filterTypes: {
    type: Object,
    required: true
  }
});

const logStore = useLogStore();
const userStore = useUserStore();
const orderStore = useOrderStore();
const scheduleStore = useScheduleStore();
const raeProductStore = useRaeProductStore();
const { role } = storeToRefs(userStore);
const { filters, filtersSetting } = storeToRefs(
  element == 'Order' ? orderStore :
    element == 'Schedule' ? scheduleStore :
      element == 'Log' ? logStore : raeProductStore
);

const isMobile = mobile.setupMobileUtils();
const previousDateType = ref(filtersSetting.value.dateType);

const dateFilterTypes = role.value != 'Customer' || element != 'Order'
  ? filterTypes
  : Object.fromEntries(Object.entries(filterTypes).filter(
    ([key]) => ['drc', 'dpc', 'created_at'].includes(key)
  ));

const formatFilters = () => {
  if (!filters.value[`${dateFilterTypes[filtersSetting.value.dateType].entity}.${filtersSetting.value.dateType}`])
    filters.value[`${dateFilterTypes[filtersSetting.value.dateType].entity}.${filtersSetting.value.dateType}`] = [null, null];
};

formatFilters();
watch(filters, () => {
  formatFilters();
}, { deep: true });

const updateDateType = (newValue) => {
  delete filters.value[`${dateFilterTypes[filtersSetting.value.dateType].entity}.${previousDateType.value}`];
  filters.value[`${dateFilterTypes[filtersSetting.value.dateType].entity}.${newValue}`] = [null, null];
  previousDateType.value = newValue;
};

const updateDoubleDates = () => {
  filtersSetting.value.doubleDates = !filtersSetting.value.doubleDates;
  filters.value[`${dateFilterTypes[filtersSetting.value.dateType].entity}.${filtersSetting.value.dateType}`][1] = null;
};
</script>
