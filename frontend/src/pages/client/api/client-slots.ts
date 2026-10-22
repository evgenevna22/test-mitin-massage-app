import { api } from '@/shared/api';
import type { BookSlotPayload, ClientSlotDTO, MasterDTO } from '../model';

export class ClientSlotsApi {
  public static getMasters = async (): Promise<MasterDTO[]> => {
    return (await api.get('slots/masters')).data;
  };

  // rename to: getAvailableSlots
  public static getAppointments = async (
    masterId: string,
    year: number,
    month: string
  ): Promise<ClientSlotDTO[] | undefined> => {
    return (
      await api.get(
        `slots/availability/${encodeURIComponent(masterId)}/${year}/${month}`
      )
    ).data;
  };

  public static getSlots = async (
    masterId: string,
    date: string
  ): Promise<ClientSlotDTO[] | undefined> => {
    return (await api.get(`slots/${encodeURIComponent(masterId)}/date/${date}`))
      .data;
  };

  public static bookSlot = async (
    id: string,
    payload: BookSlotPayload
  ): Promise<undefined> => {
    return (await api.put(`slots/${encodeURIComponent(id)}/book`, payload))
      .data;
  };
}
