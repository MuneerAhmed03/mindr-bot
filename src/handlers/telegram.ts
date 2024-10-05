import { Message } from "../types";
import { Config } from "../types";
import { query } from "./query";
import ChatBot from "../lib/utils/ai";
import { manageTxt, helpText } from "../lib/utils/prompts";

export async function sendMessage(id: number, message: string, token: string,retryCount = 0) {
  const MAX_RETRY = 2;
  const FALLBACK_TEXT = "An error occurred while processing your request. Please try again later.";
  try {
    const data = {
      chat_id: id,
      text: message,
      parse_mode: "HTML",
    };
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";
      let done = false;

      while (!done) {
        //@ts-ignore
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          result += decoder.decode(value, { stream: !done });
        }
      }

      if(retryCount<MAX_RETRY){
        console.log("Failed to send message", result)
        return sendMessage(id, FALLBACK_TEXT, token,retryCount+1);
      }
      throw new Error("Failed to send message");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to send message:", error);
    if (retryCount < MAX_RETRY) {
      return sendMessage(id, FALLBACK_TEXT, token, retryCount + 1);
    }
    throw new Error("Failed to send message");
  }
}

export async function handleCommands(message: Message, config: Config) {
  let reply;
  const messageText = message.text ?? "";
  const command = messageText.slice(1).toLowerCase().split(" ")[0];
  // console.log(command);
  switch (command) {
    case "start":
      reply =
        "Hello! I am MindR, your AI Powered Sceond Brain. How can I help you today?";
      break;
    case "help":
      reply =
        helpText;
      break;
    case "ask":
      const memories = await query(message, config);
      const bot = new ChatBot(config.AI, memories);
      const response = await bot.query(messageText);
      // console.log("final", response);
      reply = response;
      break;
    case "manage":
      reply = manageTxt;
      break;
    default:
      reply =
        "I do not understand that command. Please use /help to see the list of commands.";
      break;
  }
  return reply;
}

// export async function handleMessage(message: Message ,config :Config)  {
//   console.log("handle message started");
//   const supabase = createClient(config.SB_URL, config.SB_KEY);

//   const messageText = message.text;
//   const chat_id = message.chat.id;
//   let reply = "message recieved";

//   if (messageText?.startsWith('/')) {
//     const command = messageText.slice(1).toLowerCase();
//     switch (command) {
//       case 'start':
//         reply = 'Hello! I am MindR, your personal assistant. How can I help you today?';
//         break;
//       case 'help':
//         reply = 'You can use the following commands:\n\n/start - Start the bot\n\n/help - Show this help message';
//         break;
//       default:
//         reply = 'I do not understand that command. Please use /help to see the list of commands.';
//         break;
//     }
//   } else {
//     const uuid = uuidv4();

//     const { error } = await supabase
//     .from('memory')
//     .insert({ user_id:chat_id ,memory_id: uuid, content: messageText })
//     if(error){
//         console.log(error);
//         return;
//     }
//   }
//   return await sendMessage(chat_id, reply, config?.TELEGRAM_BOT_TOKEN);
// }
