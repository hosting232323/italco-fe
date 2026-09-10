<template>
  <v-card class="mb-6">
    <v-toolbar
      :color="theme.current.value.primaryColor"
      density="comfortable"
    >
      <v-btn
        icon="mdi-chevron-left"
        @click="shiftMonth(-1)"
      />
      <v-toolbar-title class="text-center text-capitalize">
        {{ monthLabel }}
      </v-toolbar-title>
      <v-btn
        icon="mdi-chevron-right"
        @click="shiftMonth(1)"
      />
      <v-btn
        variant="text"
        class="mr-2"
        @click="goToday"
      >
        Oggi
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <v-autocomplete
        v-model="selectedUserId"
        label="Filtra corriere"
        :items="[{ id: null, nickname: 'Tutti i corrieri' }, ...deliveryUsers]"
        item-title="nickname"
        item-value="id"
        density="comfortable"
        hide-details
        clearable
        class="mb-4"
      />

      <div class="calendar-grid week-header">
        <div
          v-for="label in weekDayLabels"
          :key="label"
          class="week-header-cell"
        >
          {{ label }}
        </div>
      </div>
      <div class="calendar-grid">
        <div
          v-for="(cell, index) in cells"
          :key="index"
          class="day-cell"
          :class="{
            'day-cell--muted': !cell.inMonth,
            'day-cell--today': cell.iso === todayIso,
            'day-cell--weekend': cell.weekend
          }"
        >
          <template v-if="cell.date">
            <div class="day-number">
              {{ cell.date.getDate() }}
            </div>
            <div class="day-body">
              <v-chip
                v-for="entry in cell.entries"
                :key="entry.userId"
                size="x-small"
                class="mb-1 mr-1"
                :color="entry.absent ? 'warning' : theme.current.value.primaryColor"
                :variant="entry.absent ? 'outlined' : 'flat'"
              >
                <span class="text-truncate">{{ entry.nickname }}</span>
                <v-tooltip
                  activator="parent"
                  location="top"
                >
                  <template v-if="entry.absent">
                    {{ entry.nickname }} — assente
                  </template>
                  <template v-else>
                    {{ entry.nickname }}:
                    {{ entry.slots.map(coverage.formatSlot).join(', ') }}
                  </template>
                </v-tooltip>
              </v-chip>
              <div
                v-if="cell.inMonth && cell.entries.length === 0"
                class="day-empty"
              >
                —
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="legend mt-4">
        <span class="legend-item">
          <v-icon
            size="small"
            :color="theme.current.value.primaryColor"
          >mdi-square-rounded</v-icon>
          Corriere in copertura
        </span>
        <span class="legend-item">
          <v-icon
            size="small"
            color="warning"
          >mdi-square-rounded-outline</v-icon>
          Assenza in un giorno altrimenti coperto
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import days from '@/utils/days';
import { useTheme } from 'vuetify';
import coverage from '@/utils/coverage';

const props = defineProps({
  deliveryUsers: {
    type: Array,
    required: true
  },
  coverages: {
    type: Array,
    required: true
  },
  absences: {
    type: Array,
    required: true
  }
});

const theme = useTheme();
const weekDayLabels = days.weekDays.map((day) => day.title.slice(0, 3));

const today = new Date();
const todayIso = coverage.toISO(today);
const cursor = ref(new Date(today.getFullYear(), today.getMonth(), 1));
const selectedUserId = ref(null);

const monthLabel = computed(() =>
  cursor.value.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
);

const shiftMonth = (delta) => {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + delta, 1);
};

const goToday = () => {
  cursor.value = new Date(today.getFullYear(), today.getMonth(), 1);
};

const visibleUsers = computed(() =>
  selectedUserId.value
    ? props.deliveryUsers.filter((user) => user.id === selectedUserId.value)
    : props.deliveryUsers
);

const cells = computed(() => {
  const year = cursor.value.getFullYear();
  const month = cursor.value.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const leading = coverage.weekDayIndex(firstOfMonth);
  const gridStart = new Date(year, month, 1 - leading);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    const inMonth = date.getMonth() === month;
    const weekDay = coverage.weekDayIndex(date);

    const entries = visibleUsers.value
      .map((user) => {
        const slots = coverage.coverageSlotsFor(user.id, date, props.coverages, props.absences);
        const absent = coverage.isAbsentOnCoveredDay(user.id, date, props.coverages, props.absences);
        if (slots.length === 0 && !absent) return null;
        return { userId: user.id, nickname: user.nickname, slots, absent };
      })
      .filter((entry) => entry);

    return {
      date,
      inMonth,
      iso: coverage.toISO(date),
      weekend: weekDay >= 5,
      entries
    };
  });
});
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.week-header {
  margin-bottom: 4px;
}

.week-header-cell {
  text-align: center;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  opacity: 0.7;
}

.day-cell {
  min-height: 96px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 4px 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.day-cell--muted {
  opacity: 0.35;
}

.day-cell--weekend {
  background: rgba(0, 0, 0, 0.03);
}

.day-cell--today {
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
}

.day-number {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.day-body {
  flex: 1;
  overflow-y: auto;
}

.day-empty {
  font-size: 0.75rem;
  opacity: 0.4;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 0.8rem;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
