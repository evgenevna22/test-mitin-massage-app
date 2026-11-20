import { STUDIO_TIME_ZONE } from '../consts';

export const isYearValid = (year: string) => /^\d{4}$/.test(year);

export const isMonthValid = (month: string) => /^(0[1-9]|1[0-2])$/.test(month);

export const getStudioDateTime = (date = new Date()) => {
  const dateTimeParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: STUDIO_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const dateTimeValues = Object.fromEntries(
    dateTimeParts.map(({ type, value }) => [type, value])
  );

  return {
    date: `${dateTimeValues.year}-${dateTimeValues.month}-${dateTimeValues.day}`,
    time: `${dateTimeValues.hour}:${dateTimeValues.minute}`,
  };
};
