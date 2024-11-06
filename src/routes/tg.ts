import { Hono } from "hono";
import { Config, Message } from "../types";
import { pick } from "../lib/utils/filter";
import { generateClient } from "../lib/utils/client";
import { v4 as uuidv4 } from "uuid";
import { handleCommands, sendMessage } from "../handlers/telegram";
import {
  welcomeMessage,
  phrases as progressPhrases,
} from "../lib/utils/prompts";

const tgRouter = new Hono<{ Bindings: Config }>();

tgRouter.post("*", async (c) => {
  const body = await c.req.json();

  const message: Message | null = pick(body);
  if (!message) {
    return c.text("invalid message");
  }

  const supabase = await generateClient(c.env.SB_URL, c.env.SB_KEY);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", message.chat.id)
    .limit(1)
    .single();

  if (error) {
    console.error("Error checking if field exists:", error);
  }

  if (data === null) {
    try {
      const response = await sendMessage(
        message.chat.id,
        welcomeMessage,
        c.env.TELEGRAM_BOT_TOKEN,
      );
      return c.json({ message: "Message sent Successfully!", response });
    } catch (error) {
      return c.json({ message: "Error sending message", error: error });
    }
  }

  // console.log(message);
  if (!message.valid) {
    const response = await sendMessage(
      message.chat.id,
      "Current Version of MindR can only store text memories",
      c.env.TELEGRAM_BOT_TOKEN,
    );
    return c.text("Invalid message");
  }

  if (message && message.text?.startsWith("/")) {
    const replyPromise = handleCommands(message, c.env);

    let index = 0;
    const intervalId = setInterval(async () => {
      if (index < progressPhrases.length) {
        try {
          await sendMessage(
            message.chat.id,
            progressPhrases[index],
            c.env.TELEGRAM_BOT_TOKEN,
          );
          index++;
        } catch (error) {
          console.log("Error sending progress phrase:", error);
        }
      } else {
        clearInterval(intervalId);
      }
    }, 3000);

    const reply = await handleCommands(message, c.env);
    clearInterval(intervalId);

    try {
      const response = await sendMessage(
        message.chat.id,
        reply,
        c.env.TELEGRAM_BOT_TOKEN,
      );
      return c.json({ message: "Message sent Successfully!", response });
    } catch (error) {
      return c.json({ message: "Error sending message", error: error });
    }
  } else {
    const uuid = uuidv4();
    const { error } = await supabase.from("memory").insert({
      user_id: message.chat.id,
      memory_id: uuid,
      content: message.text,
    });
    if (error) {
      console.log("Message insertion error", error);
      return c.json({ message: "Error saving memory", error: error });
    }
  }
  return c.text("Messag Recived successfully!");
});

tgRouter.get("/", async (c) => {
  return c.text("Hello get!");
});

export default tgRouter;
