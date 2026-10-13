import api from '.';
import type {
  BookSlotPayload,
  ClientSlotDTO,
  SlotDTO,
  SlotPayload,
} from '../types/slot';

export class SlotsApi {
  public static getAppointments = async (
    year: number,
    month: string
  ): Promise<ClientSlotDTO[] | undefined> => {
    return (await api.get(`slots/month/${year}/${month}`)).data;
  };

  public static getSlots = async (
    date: string
  ): Promise<ClientSlotDTO[] | undefined> => {
    return (await api.get(`slots/date/${date}`)).data;
  };

  public static createSlots = async (
    payload: SlotPayload
  ): Promise<undefined> => {
    return (await api.post('admin/slots', payload)).data;
  };

  public static getWorkingDates = async (
    year: number,
    month: string
  ): Promise<string[]> => {
    return (await api.get(`admin/slots/month/${year}/${month}/working-dates`))
      .data;
  };

  public static getBookedDates = async (
    year: number,
    month: string
  ): Promise<string[]> => {
    return (await api.get(`admin/slots/month/${year}/${month}/booked-dates`))
      .data;
  };

  public static loadUpcomingSlots = async (): Promise<SlotDTO[]> => {
    return (await api.get('admin/upcoming')).data;
  };

  public static bookSlot = async (
    id: string,
    payload: BookSlotPayload
  ): Promise<undefined> => {
    return (await api.put(`slots/${id}/book`, payload)).data;
  };
}
