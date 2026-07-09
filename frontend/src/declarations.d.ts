declare global {
  interface TelegramWebApp {
    ready(): void
    close(): void
    expand(): void
    isExpanded: boolean
    viewportHeight: number
    viewportStableHeight: number
    platform: string
    colorScheme: 'light' | 'dark'
    themeParams: {
      bg_color?: string
      text_color?: string
      hint_color?: string
      link_color?: string
      button_color?: string
      button_text_color?: string
    }
    initData: string
    initDataUnsafe: {
      query_id?: string
      user?: {
        id: number
        first_name: string
        last_name?: string
        username?: string
        language_code?: string
        is_premium?: boolean
      }
      auth_date: number
      hash: string
    }
    MainButton: {
      text: string
      color: string
      textColor: string
      isVisible: boolean
      isActive: boolean
      isProgressVisible: boolean
      setText(text: string): void
      onClick(callback: () => void): void
      offClick(callback: () => void): void
      show(): void
      hide(): void
      enable(): void
      disable(): void
      showProgress(leaveActive?: boolean): void
      hideProgress(): void
    }
    BackButton: {
      isVisible: boolean
      onClick(callback: () => void): void
      offClick(callback: () => void): void
      show(): void
      hide(): void
    }
    sendData(data: string): void
  }

  interface Window {
    Telegram: {
      WebApp: TelegramWebApp
    }
  }
}

export {}
