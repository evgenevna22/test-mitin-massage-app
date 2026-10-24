export type TimeSlot = {
  start: string;
  end: string;
};

export type SlotPayload = {
  dates: Array<string>;
  time: TimeSlot;
};

export type RescheduleSlotPayload = {
  sourceSlotId: string;
  targetSlotId: string;
  comment: string;
};

export type ManualBookingPayload = {
  date: string;
  time: string;
  userId: number;
  userName: string;
  massageType: string;
  comment?: string;
};

export type BookSlotPayload = {
  massageType: string;
  comment?: string;
};

export type Slot = {
  id: string;
  masterId: string;
  date: {
    day: number;
    month: number;
    year: number;
  };
  time: string;
  status: 'free' | 'booked';
  isConfirmed: boolean;
  comment?: string | null;
  massageType: string;
  userId: number | null;
  userName: string | null;
  userNickname: string | null;
};

export type SlotDTO = {
  id: string;
  masterId: string;
  date: string;
  time: string;
  status: 'free' | 'booked';
  isConfirmed: boolean;
  comment?: string | null;
  massageType: string;
  userId: number | null;
  userName: string | null;
  userNickname: string | null;
};

export type ClientSlotDTO = Pick<SlotDTO, 'id' | 'date' | 'time' | 'status'>;
