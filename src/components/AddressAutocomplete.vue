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

const extractHouseNumber = (query, road, town) => {
  if (!query) return '';
  let rest = ` ${query} `;
  [road, town].forEach((part) => {
    if (part)
      rest = rest.replace(new RegExp(part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), ' ');
  });
  rest = rest.replace(/\b\d{5}\b/g, ' '); // scarta il CAP
  const match = rest.match(/\b\d{1,4}(?:\s?(?:bis|ter))?(?:\s?[/-]?\s?[a-z])?\b/i);
  return match ? match[0].replace(/\s+/g, '').toUpperCase() : '';
};

const formatAddress = (address, query) => {
  const road =
    address.road ||
    address.pedestrian ||
    address.footway ||
    address.path ||
    address.cycleway ||
    '';
  const town =
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    address.municipality ||
    '';
  const houseNumber = address.house_number || extractHouseNumber(query, road, town);
  const street = [road, houseNumber].filter(Boolean).join(' ');
  const seen = new Set();
  return [street, town]
    .filter((part) => {
      if (!part) return false;
      const key = part.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(', ');
};

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
      const labels = [];
      data.forEach((item) => {
        const label = formatAddress(item.address || {}, query);
        if (!label || results.has(label)) return;
        results.set(label, item);
        labels.push(label);
      });
      suggestions.value = labels;
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
