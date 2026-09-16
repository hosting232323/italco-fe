<template>
  <v-input
    :model-value="formattedValue"
    :rules="rules"
    :disabled="disabled"
    :class="classStyle"
    hide-details="auto"
  >
    <div class="dpc-calendar-field">
      <label class="dpc-calendar-label text-body-1 text-medium-emphasis">{{ label }}</label>
      <div class="dpc-calendar mt-1">
        <div class="dpc-calendar-header">
          <v-btn
            icon="mdi-chevron-left"
            size="small"
            variant="text"
            :disabled="disabled || !canGoPrevMonth"
            @click="shiftMonth(-1)"
          />
          <span class="text-capitalize font-weight-medium">{{ monthLabel }}</span>
          <v-btn
            icon="mdi-chevron-right"
            size="small"
            variant="text"
            :disabled="disabled"
            @click="shiftMonth(1)"
          />
        </div>

        <div class="dpc-calendar-grid-wrapper">
          <div class="dpc-calendar-grid">
            <span
              v-for="weekDayTitle in weekDayTitles"
              :key="weekDayTitle"
              class="dpc-calendar-weekday"
            >
              {{ weekDayTitle }}
            </span>
            <div
              v-for="cell in cells"
              :key="cell.iso"
              class="dpc-calendar-cell"
              :class="{ 'dpc-calendar-cell--outside': !cell.inMonth }"
              :data-date="cell.iso"
            >
              <button
                type="button"
                class="dpc-calendar-day"
                :class="{
                  'dpc-calendar-day--disabled': !cell.allowed,
                  'dpc-calendar-day--selected': cell.iso === selectedDate && cell.slots.length === 0
                }"
                :disabled="!cell.allowed || disabled"
                @click="selectDate(cell.iso)"
              >
                {{ cell.day }}
              </button>
              <div
                v-if="cell.slots.length > 0"
                class="dpc-calendar-chips"
              >
                <v-chip
                  v-for="slot in cell.slots"
                  :key="`${slot.start}-${slot.end}`"
                  size="x-small"
                  class="mb-1"
                  :variant="isSlotSelected(cell.iso, slot) ? 'flat' : 'outlined'"
                  :color="theme.current.value.primaryColor"
                  :disabled="disabled"
                  @click="selectSlot(cell.iso, slot)"
                >
                  {{ slot.start }}-{{ slot.end }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-input>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useTheme } from 'vuetify';

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: null
  },
  slotStart: {
    type: String,
    default: null
  },
  slotEnd: {
    type: String,
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
  slots: {
    type: Object,
    default: () => ({})
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

const emits = defineEmits(['update:modelValue', 'update:slotStart', 'update:slotEnd']);

const theme = useTheme();
const weekDayTitles = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

function toISODate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d)) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function weekDayIndex(date) {
  return (date.getDay() + 6) % 7;
}

const selectedDate = ref(toISODate(props.modelValue));
const viewMonth = ref(startOfMonth(selectedDate.value ? new Date(selectedDate.value) : new Date()));

const monthLabel = computed(() =>
  viewMonth.value.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
);

const cells = computed(() => {
  const firstOfMonth = viewMonth.value;
  const startOffset = weekDayIndex(firstOfMonth);
  const gridStart = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    const iso = toISODate(date);
    return {
      iso,
      day: date.getDate(),
      inMonth: date.getMonth() === firstOfMonth.getMonth(),
      allowed: props.allowedDates.includes('all') || props.allowedDates.includes(iso),
      slots: props.slots[iso] || []
    };
  });
});

const canGoPrevMonth = computed(() => viewMonth.value > startOfMonth(new Date()));

// Finché esistono fasce per la data scelta, il campo non è "completo" senza
// una fascia selezionata: la stringa vuota fa scattare la requiredRule già
// passata dal form, niente logica di validazione duplicata qui.
const formattedValue = computed(() => {
  if (!selectedDate.value) return '';
  const slotsForDate = props.slots[selectedDate.value] || [];
  if (slotsForDate.length > 0 && (!props.slotStart || !props.slotEnd)) return '';
  return selectedDate.value;
});

function shiftMonth(delta) {
  viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() + delta, 1);
}

function isDateAllowed(iso) {
  return props.allowedDates.includes('all') || props.allowedDates.includes(iso);
}

function selectDate(iso) {
  if (props.disabled || !isDateAllowed(iso)) return;

  selectedDate.value = iso;
  emits('update:modelValue', iso);
  emits('update:slotStart', null);
  emits('update:slotEnd', null);
}

function selectSlot(iso, slot) {
  if (props.disabled || !isDateAllowed(iso)) return;

  selectedDate.value = iso;
  emits('update:modelValue', iso);
  emits('update:slotStart', slot.start);
  emits('update:slotEnd', slot.end);
}

function isSlotSelected(iso, slot) {
  return iso === selectedDate.value && slot.start === props.slotStart && slot.end === props.slotEnd;
}

watch(() => props.modelValue, (value) => {
  const iso = toISODate(value);
  if (iso !== selectedDate.value) {
    selectedDate.value = iso;
    if (iso) viewMonth.value = startOfMonth(new Date(iso));
  }
});
</script>

<style scoped>
.dpc-calendar-field {
  width: 100%;
  flex: 1 1 auto;
}

.dpc-calendar-label {
  display: block;
}

.dpc-calendar {
  width: 100%;
  padding: 12px 0;
}

.dpc-calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.dpc-calendar-grid-wrapper {
  overflow-x: auto;
}

.dpc-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(64px, 1fr));
  gap: 4px;
  width: 100%;
  min-width: 448px;
}

.dpc-calendar-weekday {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.6;
  padding-bottom: 4px;
}

.dpc-calendar-cell {
  min-height: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px;
  border-radius: 6px;
}

.dpc-calendar-cell--outside {
  opacity: 0.35;
}

.dpc-calendar-day {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
}

.dpc-calendar-day:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.06);
}

.dpc-calendar-day--disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.dpc-calendar-day--selected {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.dpc-calendar-chips {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-top: 2px;
}
</style>
