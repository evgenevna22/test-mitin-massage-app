import { HOUR_IN_MIN, MIN_IN_SEC, SEC_IN_MS } from '../consts';

export const isYearValid = (year: string) => /^\d{4}$/.test(year);

export const isMonthValid = (month: string) => /^(0[1-9]|1[0-2])$/.test(month);
