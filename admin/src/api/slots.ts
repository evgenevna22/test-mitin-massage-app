import api from '.'
import type { CreateSlot } from '../types'

export class SlotsApi {
  public static createSlots = async (payload: CreateSlot): Promise<any> => {
    await api.post('admin/slots', payload)
  }
}
