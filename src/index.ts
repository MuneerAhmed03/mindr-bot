import { Hono } from "hono";
import { Config, Message } from "./types";
import { initConfig, getConfig } from "./config";
import tgRouter from "./routes/tg";
import memoryRouter from "./routes/memory";
import { sendMessage } from "./handlers/telegram";
import { onBoarding } from "./lib/utils/prompts";

const app = new Hono<{ Bindings: Config }>();

app.get("/", async (c) => {
  return c.text("Hello from hono!");
});

app.post("/start", async (c) => {
  const data = await c.req.json();
  const { id } = data;

  try {
    const response = await sendMessage(
      id,
      onBoarding,
      c.env.TELEGRAM_BOT_TOKEN,
    );
    return c.json({ message: "Message sent Successfully!", response });
  } catch (error) {
    return c.json({ message: "Error sending message", error: error });
  }
});

app.route("/tg", tgRouter);
app.route("/memory", memoryRouter);

export default app;
