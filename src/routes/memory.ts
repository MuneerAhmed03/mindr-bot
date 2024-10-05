import { Hono } from "hono";
import { Config } from "../types";
import { embed } from "../lib/utils/embed";
import { generateClient } from "../lib/utils/client";

const memoryRouter = new Hono<{ Bindings: Config }>();

memoryRouter.get("/", async (c) => {
  return c.text("Hello from memory");
});

memoryRouter.post("/embed", async (c) => {
  // console.log("embeding start");
  const supabase = await generateClient(c.env.SB_URL, c.env.SB_KEY);
  const { id, text } = await c.req.json();
  const embeddings = await embed({ text: text, ai: c.env.AI });
  
  const { error } = await supabase
    .from("memory")
    .update({embedding : embeddings[0] })
    .eq("memory_id", id);
  if (error) {
    console.log("memory error", error);
    return c.json({ error: error.message });
  }
  return c.text("Embedding done");
});

export default memoryRouter;
