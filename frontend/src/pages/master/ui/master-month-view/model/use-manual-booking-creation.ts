import type { SlotDTO } from '@/pages/client/model/slot';

export const useManualBookingCreation = () => {
  const handleCreateSlot = (slot?: SlotDTO) => {
    console.log(slot);  // temporal
    
  };

  return { handleCreateSlot };
};
