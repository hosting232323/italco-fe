<template>
  <v-row no-gutters>
    <v-col
      cols="12"
      :md="filtersSetting.doubleDates ? 4: 6"
    >
      <v-text-field
        v-model="filters[`${element}.${filtersSetting.dateType}`][0]"
        :class="isMobile ? '' : 'mr-2'"
        :label="DATE_FILTER_TYPES[filtersSetting.dateType]"
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
        v-model="filters[`${element}.${filtersSetting.dateType}`][1]"
        :class="isMobile ? '' : 'ml-2 mr-2'"
        label="Data di fine intervallo"
        type="date"
        :rules="validation.futureDate(filters[`${element}.${filtersSetting.dateType}`][0])"
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
        :disabled="Object.keys(DATE_FILTER_TYPES).length == 1"
        :items="Object.entries(DATE_FILTER_TYPES).map(([value, title]) => ({value, title}))"
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

const { element, filterTypes } = defineProps({
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

const DATE_FILTER_TYPES = role.value != 'Customer' || element != 'Order'
  ? filterTypes
  : Object.fromEntries(Object.entries(filterTypes).filter(
    ([key]) => ['drc', 'dpc', 'created_at'].includes(key)
  ));

const formatFilters = () => {
  if (!filters.value[`${element}.${filtersSetting.value.dateType}`])
    filters.value[`${element}.${filtersSetting.value.dateType}`] = [null, null];
};

formatFilters();
watch(filters, () => {
  formatFilters();
}, { deep: true });

const updateDateType = (newValue) => {
  delete filters.value[`${element}.${previousDateType.value}`];
  filters.value[`${element}.${newValue}`] = [null, null];
  previousDateType.value = newValue;
};

const updateDoubleDates = () => {
  filtersSetting.value.doubleDates = !filtersSetting.value.doubleDates;
  filters.value[`${element}.${filtersSetting.value.dateType}`][1] = null;
};
</script>
