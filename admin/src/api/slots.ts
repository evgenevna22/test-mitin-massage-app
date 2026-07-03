import type { AxiosResponse } from 'axios'
import api from '.'
import type { CreateSlot, SlotDTO } from '../types'

export class SlotsApi {
  public static createSlots = async (payload: CreateSlot): Promise<any> => {
    return await api.post('admin/slots', payload)
  }

  public static loadUpcomingSlots = async (): Promise<AxiosResponse<SlotDTO[]>> => {
    return await api.get('admin/upcoming')
  }
}
