<template>
  <v-row no-gutters>
    <v-col
      cols="12"
      :md="doubleDates ? 4: 6"
    >
      <v-text-field
        v-model="filters[`${element}.${dateType}`][0]"
        :class="isMobile ? '' : 'mr-2'"
        :label="DATE_FILTER_TYPES[dateType]"
        type="date"
        clearable
        :prepend-icon="doubleDates ? 'mdi-minus' : 'mdi-plus'"
        @click:prepend="updateDoubleDates"
      />
    </v-col>
    <v-col
      v-if="doubleDates"
      cols="12"
      md="4"
    >
      <v-text-field
        v-model="filters[`${element}.${dateType}`][1]"
        :class="isMobile ? '' : 'ml-2 mr-2'"
        label="Data di fine intervallo"
        type="date"
        :rules="validation.futureDate(filters[`${element}.${dateType}`][0])"
        clearable
      />
    </v-col>
    <v-col
      cols="12"
      :md="doubleDates ? 4: 6"
    >
      <v-select
        v-model="dateType"
        label="Tipo di Data"
        :class="isMobile ? '' : 'ml-2'"
        :disabled="Object.keys(DATE_FILTER_TYPES).length == 1"
        :items="Object.entries(DATE_FILTER_TYPES).map(([value, title]) => ({value, title}))"
        @update:model-value="handleDateTypeChange"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useLogStore } from '@/stores/log';
import validation from '@/utils/validation';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';

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

const userStore = useUserStore();
const { role } = storeToRefs(userStore);

const logStore = useLogStore();
const orderStore = useOrderStore();
const scheduleStore = useScheduleStore();

const filters = computed(() => {
  switch (element) {
  case 'Order':
    return storeToRefs(orderStore).filters;
  case 'Schedule':
    return storeToRefs(scheduleStore).filters;
  case 'Log':
    return storeToRefs(logStore).filters;
  default:
    return storeToRefs(orderStore).filters;
  }
});

const DATE_FILTER_TYPES = role.value != 'Customer' || element != 'Order'
  ? filterTypes
  : Object.fromEntries(Object.entries(filterTypes).filter(
    ([key]) => ['drc', 'dpc', 'created_at'].includes(key)
  ));

const doubleDates = ref(false);
const isMobile = mobile.setupMobileUtils();
const dateType = ref(Object.keys(DATE_FILTER_TYPES)[0]);
const previousDateType = ref(dateType.value);

if (!filters.value[`${element}.${dateType.value}`])
  filters.value[`${element}.${dateType.value}`] = [null, null];

const handleDateTypeChange = (newValue) => {
  delete filters.value[`${element}.${previousDateType.value}`];
  filters.value[`${element}.${newValue}`] = [null, null];
  previousDateType.value = newValue;
};

const updateDoubleDates = () => {
  doubleDates.value = !doubleDates.value;
  filters.value[`${element}.${dateType.value}`][1] = null;
};
</script>
