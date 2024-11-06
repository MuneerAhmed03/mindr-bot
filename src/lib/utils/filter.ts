import { Message } from "../../types";

export function pick(obj: any): Message | null {
  const message: Partial<Message> = {};

  if (!("message" in obj && typeof obj.message === "object")) {
    console.error("The input object does not contain a valid 'message' field.");
    return null;
  }

  const messageObj = obj.message;

  if ("message_id" in messageObj) message.message_id = messageObj.message_id;
  if ("chat" in messageObj && typeof messageObj.chat === "object") {
    message.chat = {
      id: messageObj.chat.id,
      type: messageObj.chat.type,
    };
  }
  if ("date" in messageObj) message.date = messageObj.date;
  if ("text" in messageObj) message.text = messageObj.text;
  if ("entities" in messageObj && Array.isArray(messageObj.entities)) {
    message.entities = messageObj.entities.map((entity: any) => ({
      type: entity.type,
      offset: entity.offset,
      length: entity.length,
      language: entity.language,
      custom_emoji_id: entity.custom_emoji_id,
    }));
  }

  message.valid = isvalid(messageObj);

  return message as Message;
}
function isvalid(obj: any): boolean {
  const keys = [
    "animation",
    "audio",
    "document",
    "paid_media",
    "photo",
    "sticker",
    "story",
    "video",
    "video_note",
    "voice",
    "poll",
    "contact",
    "venue",
    "location",
  ];

  return !keys.some((key) => key in obj);
}
