import { Hono } from "hono";
import { Config, Message } from "./types";
import { initConfig, getConfig } from "./config";
import { pick, invalid } from "./lib/utils/filter";
import { handleMessage } from "./handlers/telegram";
import tgRouter from "./routes/tg"
import memoryRouter from "./routes/memory"

const app = new Hono<{ Bindings: Config }>();

app.use("*", async (c, next) => {
    initConfig(c.env);
  await next();
});

app.get("/", async (c) => {
  return c.text("Hello from hono!");
})

app.route("/tg",tgRouter);
app.route("/memory",memoryRouter);


// app.post("*", async (c) => {
//   const body = await c.req.json();
//   const config = getConfig();
//   if (invalid(body.message)) {
//   }

//   const message: Message | null = pick(body);
//   if (!message) {
//     return c.text("invalid message");
//   }
//   const result = await handleMessage(message,config);
//   return c.text("Hello post!");
// });

// app.get("/", async (c) => {
//   return c.text("Hello get!");
// });

export default app;
