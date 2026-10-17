import { ref, type Ref } from 'vue';

export const useAddWorkSlots = (workingDays: Ref<string[], string[]>) => {
  const disabledDays = ref<Date[]>([]);

  const handleClickAddSlots = () => {
    if (!workingDays.value?.length) {
      return;
    }
    disabledDays.value = workingDays.value.map((day) => new Date(day));
  };

  return {
    handleClickAddSlots,
    disabledDays,
  };
};
