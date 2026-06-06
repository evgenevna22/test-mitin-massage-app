export const useTelegram = () => {
  // Объект Telegram Web App — доступен глобально после подключения SDK
  const tg = window.Telegram.WebApp

  // Сообщаем Telegram что приложение готово (убирает лоадер)
  tg.ready()

  // Разворачиваем на весь экран
  tg.expand()

  return {
    // Данные пользователя из Telegram
    user: tg.initDataUnsafe.user,
    // Сырая строка initData — её будем отправлять на сервер для верификации
    initData: tg.initData,
    // Сам объект tg — для доступа к другим методам SDK
    tg,
  }
}
