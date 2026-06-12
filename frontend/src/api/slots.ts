import api from '.'
import type { SlotDTO } from '../types/slot'

export class SlotsApi {
  public static getSlots = async (month: string): Promise<SlotDTO[] | undefined> => {
    try {
      const reponse = await api.get('slots', { params: { month } })

      console.log('reponse', reponse)

      return reponse.data
    } catch (e) {
      console.error(e)
    }
  }
}
