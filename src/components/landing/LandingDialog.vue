<template>
  <dialog
    ref="dialog"
    @close="emit('update:modelValue', false)"
    @click="onBackdropClick"
  >
    <button
      class="dialog-close"
      :aria-label="closeLabel"
      @click="dialog.close()"
    >
      ×
    </button>
    <slot />
  </dialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  closeLabel: { type: String, default: 'Chiudi' }
});
const emit = defineEmits(['update:modelValue']);

const dialog = ref(null);

const sync = (open) => {
  if (open && !dialog.value.open)
    dialog.value.showModal();
  else if (!open && dialog.value.open)
    dialog.value.close();
};

onMounted(() => sync(props.modelValue));
watch(() => props.modelValue, sync);

const onBackdropClick = (e) => {
  if (e.target !== dialog.value)
    return;
  const r = dialog.value.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
    dialog.value.close();
};
</script>
