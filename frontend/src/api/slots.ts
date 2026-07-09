import api from '.'
import type { SlotDTO, SlotPayload } from '../types/slot'

export class SlotsApi {
  public static getAppointments = async (
    month: string
  ): Promise<SlotDTO[] | undefined> => {
    try {
      return (await api.get(`slots/month/${month}`)).data
    } catch (e) {
      console.error(e)
    }
  }

  public static getSlots = async (
    date: string
  ): Promise<SlotDTO[] | undefined> => {
    try {
      return (await api.get(`slots/date/${date}`)).data
    } catch (e) {
      console.error(e)
    }
  }

  public static createSlot = async (payload: SlotPayload): Promise<any> => {
    return await api.post('admin/slots', payload)
  }

  public static loadUpcomingSlots = async (): Promise<SlotDTO[]> => {
    return (await api.get('admin/upcoming')).data
  }
}
