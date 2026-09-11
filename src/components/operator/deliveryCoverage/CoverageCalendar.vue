<template>
  <v-card class="mb-6">
    <v-toolbar
      :color="theme.current.value.primaryColor"
      density="comfortable"
    >
      <v-btn
        icon="mdi-chevron-left"
        @click="shiftWeek(-1)"
      />
      <v-toolbar-title class="text-center text-capitalize">
        {{ weekLabel }}
      </v-toolbar-title>
      <v-btn
        icon="mdi-chevron-right"
        @click="shiftWeek(1)"
      />
      <v-btn
        variant="text"
        class="mr-2"
        @click="goToday"
      >
        Settimana corrente
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <div class="calendar-grid-wrapper">
        <div class="calendar-grid">
          <div
            v-for="cell in cells"
            :key="cell.iso"
            class="day-cell"
            :class="{ 'day-cell--today': cell.iso === todayIso, 'day-cell--weekend': cell.weekend }"
          >
            <div class="day-header">
              <span class="day-title">{{ cell.label }}</span>
              <span class="day-date">{{ cell.dateLabel }}</span>
            </div>
            <div class="day-body">
              <div
                v-for="entry in cell.entries"
                :key="entry.id"
                class="entry-block"
              >
                <div class="entry-time">
                  {{ coverage.formatSlot(entry) }}
                </div>
                <div class="entry-transport">
                  <v-icon size="x-small">
                    mdi-truck
                  </v-icon>
                  {{ transportName(entry.transport_id) }}
                </div>
                <div class="entry-caps">
                  <v-chip
                    v-for="cap in entry.caps"
                    :key="cap"
                    size="x-small"
                    class="mr-1 mb-1"
                    :color="theme.current.value.primaryColor"
                    variant="flat"
                  >
                    {{ cap }}
                  </v-chip>
                </div>
              </div>
              <div
                v-if="cell.entries.length === 0"
                class="day-empty"
              >
                Nessuna copertura
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import days from '@/utils/days';
import { useTheme } from 'vuetify';
import coverage from '@/utils/coverage';
import storesUtils from '@/utils/stores';
import { useTransportStore } from '@/stores/transport';

const props = defineProps({
  entries: {
    type: Array,
    required: true
  }
});

const theme = useTheme();
const transportStore = useTransportStore();
const transports = storesUtils.getStoreList(transportStore);

const today = new Date();
const todayIso = coverage.toISO(today);
const cursor = ref(coverage.startOfWeek(today));

// "3 - 9 novembre 2026" nella stessa settimana/mese, "28 ott - 3 nov 2026"
// quando la settimana scavalca il mese.
const weekLabel = computed(() => {
  const week = coverage.weekDays(cursor.value);
  const start = week[0];
  const end = week[6];
  const sameMonth = start.getMonth() === end.getMonth();

  const startLabel = sameMonth
    ? start.getDate()
    : start.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  const endLabel = end.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });

  return `${startLabel} - ${endLabel}`;
});

const shiftWeek = (delta) => {
  const next = new Date(cursor.value.getFullYear(), cursor.value.getMonth(), cursor.value.getDate() + delta * 7);
  cursor.value = coverage.startOfWeek(next);
};

const goToday = () => {
  cursor.value = coverage.startOfWeek(today);
};

const transportName = (transportId) =>
  transports.value.find((transport) => transport.id === transportId)?.name || `ID ${transportId}`;

const cells = computed(() =>
  coverage.weekDays(cursor.value).map((date) => {
    const weekDay = coverage.weekDayIndex(date);
    return {
      iso: coverage.toISO(date),
      label: days.weekDays[weekDay].title,
      dateLabel: date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
      weekend: weekDay >= 5,
      entries: coverage.entriesForWeekDay(weekDay, props.entries)
    };
  })
);
</script>

<style scoped>
.calendar-grid-wrapper {
  overflow-x: auto;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(140px, 1fr));
  gap: 8px;
  min-width: 900px;
}

.day-cell {
  min-height: 180px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
}

.day-cell--weekend {
  background: rgba(0, 0, 0, 0.03);
}

.day-cell--today {
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
}

.day-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
}

.day-title {
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  opacity: 0.7;
}

.day-date {
  font-size: 0.85rem;
}

.day-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.entry-block {
  border-radius: 6px;
  padding: 4px 6px;
  background: rgba(0, 0, 0, 0.04);
}

.entry-time {
  font-weight: 600;
  font-size: 0.8rem;
}

.entry-transport {
  font-size: 0.75rem;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.entry-caps {
  margin-top: 2px;
}

.day-empty {
  font-size: 0.75rem;
  opacity: 0.4;
}
</style>
