import api from '.';
import type { SlotDTO, SlotPayload } from '../types/slot';

export class MasterSlotsApi {
  public static createSlots = async (
    payload: SlotPayload
  ): Promise<undefined> => {
    return (await api.post('master/slots', payload)).data;
  };

  public static getSlotsByMonth = async (
    year: number,
    month: string
  ): Promise<SlotDTO[]> => {
    return (await api.get(`master/slots/${year}/${month}`)).data;
  };

  public static getWorkingDates = async (
    year: number,
    month: string
  ): Promise<string[]> => {
    return (await api.get(`master/working-dates/${year}/${month}`)).data;
  };

  public static getBookedDates = async (
    year: number,
    month: string
  ): Promise<string[]> => {
    return (await api.get(`master/booked-dates/${year}/${month}`)).data;
  };

  public static getUpcomingSlots = async (): Promise<SlotDTO[]> => {
    return (await api.get('master/upcoming')).data;
  };
}
