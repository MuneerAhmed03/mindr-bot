import { Hono } from "hono";
import { Config, Message } from "../types";
import { initConfig, getConfig } from "../config";
import { pick, invalid } from "../lib/utils/filter";
import { generateClient } from "../lib/utils/client";
import { v4 as uuidv4 } from "uuid";
import {
  handleCommands,
  sendMessage,
} from "../handlers/telegram";

const tgRouter = new Hono<{ Bindings: Config }>();

// tgrouter.use("*", async (c, next) => {
//     initConfig(c.env);
//   await next();
// });

tgRouter.post("*", async (c) => {
  const body = await c.req.json();
  if (invalid(body.message)) {
    const response = await sendMessage(
      body.message.chat_id,
      "Current Version of MindR can only store text memories",
      c.env.TELEGRAM_BOT_TOKEN
    );
    return c.json({ message: "Invalid Submission!", response });
  }

  const message: Message | null = pick(body);
  if (!message) {
    return c.text("invalid message");
  }

  if (message.text?.startsWith("/")) {
    const reply = await handleCommands(message, c.env);

    try {
      const response = await sendMessage(
        message.chat.id,
        reply,
        c.env.TELEGRAM_BOT_TOKEN
      );
      return c.json({ message: "Message sent Successfully!", response });
    } catch (error) {
      return c.json({ message: "Error sending message", error: error });
    }
  } else {

    const supabase = await generateClient(c.env.SB_URL,c.env.SB_KEY);
    const uuid = uuidv4();
    const { error } = await supabase
      .from("memory")
      .insert({
        user_id: message.chat.id,
        memory_id: uuid,
        content: message.text,
      });
    if (error) {
      console.log(error);
      return c.json({ message: "Error saving memory", error: error });
    }
  }
  return c.text("Messag Recived successfully!");
});

tgRouter.get("/", async (c) => {
  return c.text("Hello get!");
});

export default tgRouter;
