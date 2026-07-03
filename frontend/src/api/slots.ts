import api from '.'
import type { SlotDTO } from '../types/slot'

export class SlotsApi {
  public static getAppointments = async (
    month: string
  ): Promise<SlotDTO[] | undefined> => {
    try {
      const reponse = await api.get(`slots/month/${month}`)

      return reponse.data
    } catch (e) {
      console.error(e)
    }
  }

  public static getSlots = async (
    date: string
  ): Promise<SlotDTO[] | undefined> => {
    try {
      const reponse = await api.get(`slots/date/${date}`)

      console.log('getSlots: ', reponse)

      return reponse.data
    } catch (e) {
      console.error(e)
    }
  }
}
