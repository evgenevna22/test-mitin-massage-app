export type TimeSlot = {
  start: ''
  end: ''
  duration: ''
  gap: ''
}

export type SlotPayload = {
  dates: Array<string>
  time: TimeSlot
}

export type Slot = {
  id: string
  date: {
    day: number
    month: number
    year: number
  }
  time: string
  status: 'free' | 'booked'
  userId: number | null
  userName: string | null
  userNickname: string | null
}

export type SlotDTO = {
  id: string
  date: string
  time: string
  status: 'free' | 'booked'
  userId: number | null
  userName: string | null
  userNickname: string | null
}
