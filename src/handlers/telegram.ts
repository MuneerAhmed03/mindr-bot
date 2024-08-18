import { Message } from "../types";
import axios from "axios";
import { Config } from "../types";
import { getConfig } from "../config";
import { addMemory } from "./mem0";


// async function sendMessage(id: number, message: string) {
//   try {
//     return await axios.get(`https://api.telegram.org/bot${config?.TELEGRAM_BOT_TOKEN}/sendMessage`, {
//       params: {
//         chat_id: id,
//         text: message,
//       },
//     });
//   } catch (error) {
//     console.error("Failed to send message:", error);
//     throw new Error("Failed to send message");
//   }
// }

async function sendMessage(id: number, message: string, token: string) {
    try {
        console.log("token", token);
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${id}&text=${message}`);
      if (!response.ok) {
        console.log("Failed to send message" , response);
        throw new Error("Failed to send message");
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to send message:", error);
      throw new Error("Failed to send message");
    }
  }
  

export async function handleMessage(message: Message ,config :Config)  {
    
  const messageText = message.text ?? " ";
  const chat_id = message.chat.id;
  let reply = "";

  if (messageText?.startsWith('/')) {
    const command = messageText.slice(1).toLowerCase(); 
    switch (command) {
      case 'start':
        reply = 'Hello! I am MindR, your personal assistant. How can I help you today?';
        break;
      case 'help':
        reply = 'You can use the following commands:\n\n/start - Start the bot\n\n/help - Show this help message';
        break;
      default:
        reply = 'I do not understand that command. Please use /help to see the list of commands.';
        break;
    }
  } else {
    reply = messageText ?? ""; 
  }
  const response  = await addMemory(messageText,chat_id ,config?.MEM0_API_KEY);
  console.log("added memory ", response);
  return await sendMessage(chat_id, reply, config?.TELEGRAM_BOT_TOKEN);
}
