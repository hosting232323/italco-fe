<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290"
    min-width="auto"
  >
    <template #activator="{ props }">
      <v-text-field
        v-bind="props"
        v-model="formattedValue"
        :label="label"
        :class="classStyle"
        readonly
        clearable
        @click:clear="clearDate"
        :rules="rules"
      >
        <template #append-inner>
          <v-icon>mdi-calendar</v-icon>
        </template>
      </v-text-field>
    </template>
    <v-date-picker
      v-model="innerValue"
      :allowed-dates="allowedDates"
      @change="closeMenu"
    >
      <template #title></template>
      <template #header></template>
    </v-date-picker>
  </v-menu>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: [String, Date],
  label: String,
  allowedDates: Function,
  rules: Array,
  classStyle: String
});

const emits = defineEmits(['update:modelValue']);

const menu = ref(false);
const innerValue = ref(props.modelValue);

const formattedValue = ref(formatDate(innerValue.value));

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d)) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
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
  emits('update:modelValue', val);
});

watch(() => props.modelValue, val => {
  innerValue.value = val;
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
