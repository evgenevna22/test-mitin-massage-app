<template>
  <div class="client-page schedule-page">
    <header class="page-header">
      <Button
        class="back-button"
        icon="pi pi-arrow-left"
        aria-label="Back to home"
        text
        @click="handleBackHome"
      />
      <div>
        <p class="eyebrow">FIND YOUR MOMENT</p>
        <h1>Choose a time</h1>
      </div>
      <span class="header-mark">M*</span>
    </header>

    <section class="schedule-panel">
      <Tabs v-model:value="activeTab">
        <TabList>
          <Tab value="calendar">Calendar</Tab>
          <Tab value="days">Next available</Tab>
        </TabList>

        <TabPanels>
          <TabPanel value="calendar">
            <p class="panel-hint">
              Days without an available session are muted.
            </p>
            <CalendarPicker
              :disabled-dates="disabledDates"
              :min-date="today"
              @date-select="handleCalendarDateSelect"
              @month-change="handleMonthChange"
            />
          </TabPanel>

          <TabPanel value="days">
            <p class="panel-hint">The closest days with an open session.</p>
            <div v-if="nextAvailableDays.length" class="day-carousel">
              <button
                v-for="day in nextAvailableDays"
                :key="day.key"
                class="day-card"
                :class="{ 'day-card--selected': selectedDateKey === day.key }"
                type="button"
                @click="handleSelectAvailableDay(day.key)"
              >
                <span class="day-card__weekday">{{ day.weekday }}</span>
                <span class="day-card__date">{{ day.day }}</span>
                <span class="day-card__month">{{ day.month }}</span>
              </button>
            </div>
            <p v-else class="empty-state">
              There are no upcoming open sessions yet.
            </p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </section>

    <section class="schedule-list" aria-labelledby="schedule-title">
      <div class="schedule-list__heading">
        <div>
          <p class="eyebrow">AVAILABLE SESSIONS</p>
          <h2 id="schedule-title">{{ formattedSelectedDate }}</h2>
        </div>
        <span class="slot-count" v-if="timeSlots.length">
          {{ timeSlots.length }} {{ timeSlots.length === 1 ? 'slot' : 'slots' }}
        </span>
      </div>

      <SkeletonProgress v-if="isLoadingSlots" />
      <div v-else-if="timeSlots.length" class="time-slots">
        <button
          v-for="slot in timeSlots"
          :key="slot.id"
          class="time-slot"
          type="button"
          @click="handleChooseSlot(slot)"
        >
          <span class="time-slot__time">{{ slot.time }}</span>
          <span class="time-slot__duration">60 min session</span>
          <span class="time-slot__action" aria-hidden="true">
            <i class="pi pi-arrow-up-right" />
          </span>
        </button>
      </div>
      <p v-else class="empty-state">
        Choose an available day to see open times.
      </p>
    </section>

    <footer class="schedule-footer">
      <span>MITIN MASSAGE</span>
      <span>YOUR TIME, YOUR PACE</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { DatePickerMonthChangeEvent } from 'primevue';
import { transformDate } from '@shared/lib';
import { SkeletonProgress } from '@/shared/ui';
import CalendarPicker from '@/shared/ui/calendar/Calendar.vue';
import { useSlotsStore } from '../../model/slots-store';
import type { ClientSlotDTO } from '../../model';
import { useCalendar } from './use-calendar';
import { useGetAppointments } from './use-get-appointments';
import { useSlots } from '../slots/use-client-slots';

type DayOption = {
  key: string;
  weekday: string;
  day: string;
  month: string;
};

const route = useRoute();
const router = useRouter();
const masterId = String(route.params.masterId);
const slotsStore = useSlotsStore();
slotsStore.selectMaster(masterId);

const today = new Date();
const activeTab = ref('calendar');
const selectedDate = ref<Date>(today);
const { disabledDates, selectCurrentMonth } = useCalendar();
const { appointments, selectDate, selectMonth } = useGetAppointments();
const { getSlotsByDay } = useSlots();

const availableDateKeys = computed(() =>
  Array.from(
    new Set(
      appointments.value
        .filter((appointment) => appointment.status === 'free')
        .map((appointment) => appointment.date)
        .filter((date) => date >= transformDate(today))
    )
  ).sort()
);

const nextAvailableDays = computed<DayOption[]>(() =>
  availableDateKeys.value.slice(0, 4).map((key) => {
    const date = new Date(`${key}T12:00:00`);

    return {
      key,
      weekday: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date),
      day: new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date),
      month: new Intl.DateTimeFormat('en', { month: 'short' }).format(date),
    };
  })
);

const selectedDateKey = computed(() => transformDate(selectedDate.value));
const isLoadingSlots = computed(() => slotsStore.areCurrentSlotsLoading);
const timeSlots = computed(() =>
  [...slotsStore.currentSlots].sort((left, right) =>
    left.time.localeCompare(right.time)
  )
);
const formattedSelectedDate = computed(() =>
  new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(selectedDate.value)
);

const handleBackHome = () => {
  router.push({ name: 'ClientHome' });
};

const handleLoadSelectedDate = async (date: Date) => {
  selectedDate.value = date;
  await selectDate(transformDate(date));
  await getSlotsByDay();
};

const handleCalendarDateSelect = async (value: Date | Date[]) => {
  if (value instanceof Date) {
    await handleLoadSelectedDate(value);
  }
};

const handleSelectAvailableDay = async (dateKey: string) => {
  activeTab.value = 'days';
  await handleLoadSelectedDate(new Date(`${dateKey}T12:00:00`));
};

const handleMonthChange = ({ month, year }: DatePickerMonthChangeEvent) => {
  selectCurrentMonth(year, month);
  selectMonth(year, month);
};

const handleChooseSlot = (slot: ClientSlotDTO) => {
  router.push({
    name: 'ClientBooking',
    params: {
      masterId,
      slotId: slot.id,
      date: slot.date,
    },
  });
};

watch(
  availableDateKeys,
  async (dates) => {
    if (!dates.length || slotsStore.selectedDate) {
      return;
    }

    const firstAvailableDate = new Date(`${dates[0]}T12:00:00`);
    await handleLoadSelectedDate(firstAvailableDate);
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.schedule-page {
  min-height: 100svh;
  padding: 18px 18px 24px;
}

.page-header {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: 12px;
  margin: 8px 0 24px;
}

.page-header h1 {
  margin-top: 4px;
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.05em;
}

.back-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #fff;
}

.header-mark {
  color: var(--color-client-orange);
  font-size: 18px;
  font-weight: 800;
}

.schedule-panel {
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 22px;
  background: #111313;
}

.schedule-panel :deep(.p-tablist) {
  padding: 0 14px;
  background: transparent;
}

.schedule-panel :deep(.p-tab) {
  flex: 1;
  justify-content: center;
  padding: 14px 8px;
  color: rgb(255 255 255 / 52%);
  font-size: 13px;
}

.schedule-panel :deep(.p-tab-active) {
  color: #fff;
}

.schedule-panel :deep(.p-tabpanels) {
  padding: 16px 12px 18px;
  background: transparent;
  color: #fff;
}

.panel-hint {
  margin: 0 4px 12px;
  color: rgb(255 255 255 / 52%);
  font-size: 12px;
}

.schedule-panel :deep(.p-datepicker) {
  width: 100%;
  border: 0;
  background: transparent;
  color: #fff;
}

.schedule-panel :deep(.p-datepicker-header) {
  border-color: rgb(255 255 255 / 10%);
  background: transparent;
  color: #fff;
}

.schedule-panel :deep(.p-datepicker-title),
.schedule-panel :deep(.p-datepicker-weekday),
.schedule-panel :deep(.p-datepicker-day) {
  color: #fff;
}

.schedule-panel :deep(.p-datepicker-day) {
  width: 2.55rem;
  height: 2.55rem;
}

.schedule-panel :deep(.p-datepicker-day-selected) {
  background: var(--color-client-blue);
  color: #fff;
}

.schedule-panel :deep(.p-disabled .p-datepicker-day) {
  color: rgb(255 255 255 / 22%);
}

.day-carousel {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 12px 2px;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.day-card {
  display: grid;
  flex: 0 0 76px;
  min-height: 112px;
  place-content: center;
  gap: 4px;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 16px;
  background: rgb(255 255 255 / 4%);
  color: #fff;
  scroll-snap-align: start;
}

.day-card--selected {
  border-color: var(--color-client-blue);
  background: rgb(0 148 255 / 13%);
}

.day-card__weekday,
.day-card__month {
  color: rgb(255 255 255 / 52%);
  font-size: 11px;
  text-transform: uppercase;
}

.day-card__date {
  font-size: 26px;
  font-weight: 650;
  line-height: 1.1;
}

.schedule-list {
  padding: 28px 2px 0;
}

.schedule-list__heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.schedule-list__heading h2 {
  margin-top: 6px;
  color: #fff;
  font-size: 22px;
  font-weight: 550;
  letter-spacing: -0.035em;
}

.slot-count {
  padding-bottom: 5px;
  color: rgb(255 255 255 / 45%);
  font-size: 12px;
}

.time-slots {
  display: grid;
  gap: 9px;
}

.time-slot {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 2px 12px;
  padding: 15px 16px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 16px;
  background: #111313;
  color: #fff;
  text-align: left;
}

.time-slot__time {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.04em;
}

.time-slot__duration {
  color: rgb(255 255 255 / 48%);
  font-size: 12px;
}

.time-slot__action {
  grid-column: 2;
  grid-row: 1 / 3;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  background: rgb(0 148 255 / 15%);
  color: var(--color-client-blue);
}

.empty-state {
  padding: 20px 16px;
  border: 1px dashed rgb(255 255 255 / 15%);
  border-radius: 16px;
  color: rgb(255 255 255 / 50%);
  font-size: 13px;
  line-height: 1.5;
}

.schedule-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 34px;
  color: rgb(255 255 255 / 36%);
  font-size: 9px;
  letter-spacing: 0.12em;
}
</style>
