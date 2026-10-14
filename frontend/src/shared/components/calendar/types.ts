export type CalendarProps = {
  preSelectedDate: Date;
  mode?: 'multiple' | '';
  disabledDates?: Date[];
  workingDates?: string[];
  bookedDates?: string[];
};
