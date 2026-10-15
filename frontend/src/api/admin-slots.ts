import api from '.';
import type { SlotDTO, SlotPayload } from '../types/slot';

export class AdminSlotsApi {
  public static createSlots = async (
    payload: SlotPayload
  ): Promise<undefined> => {
    return (await api.post('admin/slots', payload)).data;
  };

  public static getSlotsByMonth = async (
    year: number,
    month: string
  ): Promise<SlotDTO[]> => {
    return (await api.get(`admin/slots/${year}/${month}`)).data;
  };

  public static getWorkingDates = async (
    year: number,
    month: string
  ): Promise<string[]> => {
    return (await api.get(`admin/working-dates/${year}/${month}`)).data;
  };

  public static getBookedDates = async (
    year: number,
    month: string
  ): Promise<string[]> => {
    return (await api.get(`admin/booked-dates/${year}/${month}`)).data;
  };

  public static getUpcomingSlots = async (): Promise<SlotDTO[]> => {
    return (await api.get('admin/upcoming')).data;
  };
}
