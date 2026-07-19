import api from '.'
import type { SlotDTO, SlotPayload } from '../types/slot'

export class SlotsApi {
  public static getAppointments = async (
    month: string
  ): Promise<SlotDTO[] | undefined> => {
    return (await api.get(`slots/month/${month}`)).data
  }

  public static getSlots = async (
    date: string
  ): Promise<SlotDTO[] | undefined> => {
    return (await api.get(`slots/date/${date}`)).data
  }

  public static createSlots = async (
    payload: SlotPayload
  ): Promise<undefined> => {
    return (await api.post('admin/slots', payload)).data
  }

  public static loadUpcomingSlots = async (): Promise<SlotDTO[]> => {
    return (await api.get('admin/upcoming')).data
  }

  public static bookSlot = async (id: string): Promise<undefined> => {
    return (await api.put(`slots/${id}/book`)).data
  }
}
