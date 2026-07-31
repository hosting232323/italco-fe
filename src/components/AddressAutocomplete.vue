<template>
  <v-combobox
    v-model="localValue"
    :label="label"
    :class="customClass"
    :rules="rules"
    :items="suggestions"
    no-filter
    clearable
    hide-no-data
    @update:search="onSearch"
    @update:model-value="onSelect"
  />
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  label: {
    type: String,
    required: true
  },
  rules: {
    type: Array,
    required: true
  },
  customClass: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'addressComponents']);

const NOMINATIM_URL = 'https://nominatim.ares-logistics.it';

const localValue = ref(props.modelValue);
const suggestions = ref([]);
const results = new Map();
let debounceId = null;

const onSearch = (query) => {
  emit('update:modelValue', query);
  clearTimeout(debounceId);
  if (!query || query.length < 3) {
    suggestions.value = [];
    return;
  }
  debounceId = setTimeout(async () => {
    try {
      const res = await fetch(
        `${NOMINATIM_URL}/search?format=json&addressdetails=1&countrycodes=it&limit=5&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      results.clear();
      data.forEach((item) => results.set(item.display_name, item));
      suggestions.value = data.map((item) => item.display_name);
    } catch {
      suggestions.value = [];
    }
  }, 400);
};

const onSelect = (value) => {
  emit('update:modelValue', value);
  const item = results.get(value);
  if (item)
    emit('addressComponents', { address: value, cap: item.address?.postcode || '' });
};
</script>
