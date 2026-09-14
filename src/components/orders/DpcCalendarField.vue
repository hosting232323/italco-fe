<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="auto"
  >
    <template #activator="{ props: activatorProps }">
      <v-text-field
        v-bind="activatorProps"
        :model-value="formattedValue"
        :label="label"
        :class="classStyle"
        readonly
        :clearable="clearable"
        :rules="rules"
        :disabled="disabled"
        @click:clear="clearSelection"
      >
        <template #append-inner>
          <v-icon>mdi-calendar-clock</v-icon>
        </template>
      </v-text-field>
    </template>

    <v-card
      class="dpc-calendar"
      min-width="290"
    >
      <div class="dpc-calendar-header">
        <v-btn
          icon="mdi-chevron-left"
          size="small"
          variant="text"
          :disabled="!canGoPrevMonth"
          @click="shiftMonth(-1)"
        />
        <span class="text-capitalize">{{ monthLabel }}</span>
        <v-btn
          icon="mdi-chevron-right"
          size="small"
          variant="text"
          :disabled="!canGoNextMonth"
          @click="shiftMonth(1)"
        />
      </div>

      <div class="dpc-calendar-grid">
        <span
          v-for="weekDayTitle in weekDayTitles"
          :key="weekDayTitle"
          class="dpc-calendar-weekday"
        >
          {{ weekDayTitle }}
        </span>
        <button
          v-for="cell in cells"
          :key="cell.iso"
          type="button"
          class="dpc-calendar-day"
          :class="{
            'dpc-calendar-day--outside': !cell.inMonth,
            'dpc-calendar-day--disabled': !cell.allowed,
            'dpc-calendar-day--selected': cell.iso === selectedDate
          }"
          :disabled="!cell.allowed"
          @click="selectDate(cell.iso)"
        >
          {{ cell.day }}
        </button>
      </div>

      <template v-if="selectedDate">
        <v-divider class="my-3" />
        <div class="dpc-calendar-slots">
          <template v-if="slotsForSelectedDate.length > 0">
            <p class="text-caption text-medium-emphasis mb-2">
              Fasce orarie disponibili:
            </p>
            <v-chip
              v-for="slot in slotsForSelectedDate"
              :key="`${slot.start}-${slot.end}`"
              class="mr-2 mb-2"
              :variant="isSlotSelected(slot) ? 'flat' : 'outlined'"
              :color="theme.current.value.primaryColor"
              @click="selectSlot(slot)"
            >
              {{ slot.start }} - {{ slot.end }}
            </v-chip>
          </template>
          <p
            v-else
            class="text-caption text-medium-emphasis"
          >
            Nessuna fascia oraria specifica per questa data.
          </p>
        </div>
      </template>
    </v-card>
  </v-menu>
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
  },
  clearable: {
    type: Boolean,
    default: true
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

const menu = ref(false);
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
      allowed: props.allowedDates.includes('all') || props.allowedDates.includes(iso)
    };
  });
});

const slotsForSelectedDate = computed(() => props.slots[selectedDate.value] || []);

const canGoPrevMonth = computed(() => viewMonth.value > startOfMonth(new Date()));

const canGoNextMonth = computed(() => {
  const limit = startOfMonth(new Date());
  limit.setMonth(limit.getMonth() + 2);
  return viewMonth.value < limit;
});

// Finché esistono fasce per la data scelta, il campo non è "completo" senza
// una fascia selezionata: la stringa vuota fa scattare la requiredRule già
// passata dal form, niente logica di validazione duplicata qui.
const formattedValue = computed(() => {
  if (!selectedDate.value) return '';
  const [year, month, day] = selectedDate.value.split('-');
  const datePart = `${day}/${month}/${year}`;
  if (slotsForSelectedDate.value.length > 0) {
    if (!props.slotStart || !props.slotEnd) return '';
    return `${datePart} ${props.slotStart}-${props.slotEnd}`;
  }
  return datePart;
});

function shiftMonth(delta) {
  viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() + delta, 1);
}

function selectDate(iso) {
  if (!props.allowedDates.includes('all') && !props.allowedDates.includes(iso)) return;

  selectedDate.value = iso;
  emits('update:modelValue', iso);
  emits('update:slotStart', null);
  emits('update:slotEnd', null);

  if ((props.slots[iso] || []).length === 0) menu.value = false;
}

function selectSlot(slot) {
  emits('update:slotStart', slot.start);
  emits('update:slotEnd', slot.end);
  menu.value = false;
}

function isSlotSelected(slot) {
  return slot.start === props.slotStart && slot.end === props.slotEnd;
}

function clearSelection() {
  selectedDate.value = null;
  emits('update:modelValue', null);
  emits('update:slotStart', null);
  emits('update:slotEnd', null);
  menu.value = false;
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
.dpc-calendar {
  padding: 12px;
}

.dpc-calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 8px;
}

.dpc-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.dpc-calendar-weekday {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.6;
  padding-bottom: 4px;
}

.dpc-calendar-day {
  aspect-ratio: 1;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
}

.dpc-calendar-day:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.06);
}

.dpc-calendar-day--outside {
  opacity: 0.35;
}

.dpc-calendar-day--disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.dpc-calendar-day--selected {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}

.dpc-calendar-slots {
  padding-top: 4px;
}
</style>
