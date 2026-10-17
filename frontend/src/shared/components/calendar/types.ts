export type CalendarProps = {
  mode?: 'multiple' | 'single';
  disabledDates?: Date[];
  workingDates?: string[];
  bookedDates?: string[];
};
