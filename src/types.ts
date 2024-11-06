export type ENV = {
  TELEGRAM_BOT_TOKEN: string;
  MEM0_API_KEY: string;
  LLAMA_API_KEY: string;
};

export type Config = {
  TELEGRAM_BOT_TOKEN: string;
  AI: Ai;
  SB_URL: string;
  SB_KEY: string;
};

export type Message = {
  message_id: number;
  chat: Chat;
  date: number;
  text?: string;
  entities?: MessageEntity[];
  valid: boolean;
};
export type Chat = {
  id: number;
  type: string;
};
export type MessageEntity = {
  type: string;
  offset: number;
  length: number;
  language?: string;
  custom_emoji_id?: string;
};
