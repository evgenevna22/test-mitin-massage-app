export const formatDate = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export const transformDate = (date: Date) => {
  if (!date) {
    return '';
  }

  return formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
};
