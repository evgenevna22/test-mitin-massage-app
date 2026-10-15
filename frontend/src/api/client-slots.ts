import api from '.';
import type { BookSlotPayload, ClientSlotDTO } from '../types/slot';

export class ClientSlotsApi {
  // rename to: getAvailableSlots
  public static getAppointments = async (
    year: number,
    month: string
  ): Promise<ClientSlotDTO[] | undefined> => {
    return (await api.get(`slots/availability/${year}/${month}`)).data;
  };

  public static getSlots = async (
    date: string
  ): Promise<ClientSlotDTO[] | undefined> => {
    return (await api.get(`slots/date/${date}`)).data;
  };

  public static bookSlot = async (
    id: string,
    payload: BookSlotPayload
  ): Promise<undefined> => {
    return (await api.put(`slots/${id}/book`, payload)).data;
  };
}
