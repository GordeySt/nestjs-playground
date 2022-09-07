import { ConfigService } from "@nestjs/config";

export const getTelegramConfig = (configService: ConfigService) => {
  const token = configService.get('TELEGRAM_TOKEN');

  if (!token) {
    throw new Error('Telegram Token not set');
  }

  return {
    token,
    chatId: configService.get('CHAT_ID') ?? ''
  };
}