import { Hono } from "hono";
import { Config, Message } from "../types";
import { initConfig, getConfig } from "../config";
import { pick, invalid } from "../lib/utils/filter";
import { handleMessage } from "../handlers/telegram";

const tgRouter = new Hono<{ Bindings: Config }>();

// tgrouter.use("*", async (c, next) => {
//     initConfig(c.env);
//   await next();
// });


tgRouter.post("*", async (c) => {
  const body = await c.req.json();
  const config = getConfig();
  if (invalid(body.message)) {
  }

  const message: Message | null = pick(body);
  if (!message) {
    return c.text("invalid message");
  }
  const result = await handleMessage(message,config);
  return c.text("Hello post!");
});

tgRouter.get("/", async (c) => {
  return c.text("Hello get!");
});

export default tgRouter;
