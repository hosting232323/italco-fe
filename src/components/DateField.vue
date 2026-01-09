<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290"
    min-width="auto"
  >
    <template #activator="{ props: activatorProps }">
      <v-text-field
        v-bind="activatorProps"
        v-model="formattedValue"
        :label="label"
        :class="classStyle"
        readonly
        clearable
        :rules="rules"
        :disabled="disabled"
        @click:clear="clearDate"
      >
        <template #append-inner>
          <v-icon>mdi-calendar</v-icon>
        </template>
      </v-text-field>
    </template>
    <v-date-picker
      v-model="innerValue"
      :allowed-dates="allowedDatesFunction"
      @change="closeMenu"
    >
      <template #title />
      <template #header />
    </v-date-picker>
  </v-menu>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: null
  },
  label: {
    type: String,
    required: true
  },
  allowedDates: {
    type: Array,
    required: true
  },
  rules: {
    type: Array,
    required: true
  },
  classStyle: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['update:modelValue']);

const menu = ref(false);
const innerValue = ref(props.modelValue ? new Date(props.modelValue) : null);
const formattedValue = ref(formatDate(innerValue.value));

function allowedDatesFunction(date) {
  if (!props.allowedDates || props.allowedDates.length === 0) return false;
  const dateStr = toISODateString(date);
  return props.allowedDates.includes(dateStr);
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d)) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function toISODateString(date) {
  if (!(date instanceof Date) || isNaN(date)) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDate(str) {
  const parts = str.split('/');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const d = new Date(year, month, day);
  if (d && d.getDate() === day && d.getMonth() === month && d.getFullYear() === year) {
    return d;
  }
  return null;
}

watch(innerValue, val => {
  formattedValue.value = formatDate(val);
  emits('update:modelValue', toISODateString(val));
});

watch(() => props.modelValue, val => {
  innerValue.value = val ? new Date(val) : null;
});

watch(formattedValue, val => {
  const parsed = parseDate(val);
  if (parsed) {
    innerValue.value = parsed;
  } else if (val === '') {
    innerValue.value = null;
  }
});

function clearDate() {
  innerValue.value = null;
  formattedValue.value = '';
  menu.value = false;
}

function closeMenu() {
  menu.value = false;
}
</script>
