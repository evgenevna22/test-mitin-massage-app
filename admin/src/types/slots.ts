export type TimeSlot = {
  start: ''
  end: ''
  duration: ''
  gap: ''
}

export type CreateSlot = {
  dates: Array<string>
  time: TimeSlot
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
