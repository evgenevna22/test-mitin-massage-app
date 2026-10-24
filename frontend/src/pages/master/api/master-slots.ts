import { api } from '@/shared/api';
import type {
  MonthOccupancy,
  ManualBookingPayload,
  RescheduleSlotPayload,
  SlotDTO,
  SlotPayload,
} from '../model';

export class MasterSlotsApi {
  public static createManualBooking = async (
    payload: ManualBookingPayload
  ): Promise<{ success: boolean }> => {
    return (await api.post('master/slots/manual-booking', payload)).data;
  };

  public static createSlots = async (
    payload: SlotPayload
  ): Promise<undefined> => {
    return (await api.post('master/slots', payload)).data;
  };

  public static rescheduleSlot = async (
    payload: RescheduleSlotPayload
  ): Promise<{ success: boolean }> => {
    return (await api.post('master/slots/reschedule', payload)).data;
  };

  public static getDetailedSlotsForMonth = async (
    year: number,
    month: string
  ): Promise<SlotDTO[]> => {
    return (await api.get(`master/slots/${year}/${month}`)).data;
  };

  public static getCalendarOccupancyForMonth = async (
    year: number,
    month: string
  ): Promise<MonthOccupancy> => {
    return (await api.get(`master/calendar-dates/${year}/${month}`)).data;
  };

  public static getUpcomingSlots = async (): Promise<SlotDTO[]> => {
    return (await api.get('master/upcoming')).data;
  };
}
