<template>
  <v-text-field
    :id="inputId"
    :label="label"
    :class="customClass"
    v-model="localValue"
    :rules="computedRules"
    @input="handleInput"
    clearable
  />
</template>

<script setup>
import {
  ref,
  watch,
  onMounted,
  defineProps,
  defineEmits,
  nextTick,
  computed,
} from 'vue';

const props = defineProps({
  modelValue: String,
  label: String,
  rules: Array,
  customClass: String
});

const emit = defineEmits(['update:isValid', 'addressComponents']);
const localValue = ref(props.modelValue);
const inputId = ref(
  `google-autocomplete-${Math.random().toString(36).substr(2, 9)}`
);
let autocompleteInstance = null;
const isValidAddress = ref(true);

const handleInput = (event) => {
  isValidAddress.value = false;
  emit('update:isValid', false);
};

const initAutocomplete = async () => {
  while (!window.google?.maps?.places) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  await nextTick();
  const inputElement = document.getElementById(inputId.value);
  if (!inputElement) return;

  autocompleteInstance = new google.maps.places.Autocomplete(inputElement, {
    types: ['establishment', 'geocode'],
    componentRestrictions: { country: 'it' },
    fields: ['geometry', 'formatted_address', 'name', 'address_components'],
  });

  autocompleteInstance.addListener('place_changed', () => {
    const place = autocompleteInstance.getPlace();
    if (place.geometry && place.formatted_address) {
      const placeName = place.name || '';
      localValue.value = placeName
        ? `${placeName}, ${place.formatted_address}`
        : place.formatted_address;

      isValidAddress.value = true;
      emit('update:isValid', true);

      const addressComponents = {
        address: '',
        cap: ''
      };

      let route = '';
      let streetNumber = '';
      let city = '';
      let provnce = '';

      place.address_components.forEach((component) => {
        const types = component.types;
          if (types.includes('route')) {
            route = component.long_name;
          }
          if (types.includes('street_number')) {
            streetNumber = component.long_name;
          }
          if (types.includes('locality')) {
            city = component.long_name;
          }
          if (types.includes('postal_code')) {
            addressComponents.cap = component.long_name;
          }
          if (types.includes('administrative_area_level_2')) {
            provnce = component.short_name;
          }
      })
      addressComponents.address =  (route ?  route + ', ': '') + (streetNumber ? ' ' + streetNumber + ', ' : '') + city + ', ' + provnce;
      emit('addressComponents', addressComponents);
    }
  });
};

onMounted(() => {
  initAutocomplete();
});

watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal;
  }
);

const computedRules = computed(() => [
  ...(props.rules || []),
  () => isValidAddress.value || 'Seleziona un indirizzo valido da Google Places'
]);
</script>
