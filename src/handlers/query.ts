import { embed } from "../lib/utils/embed";
import { generateClient } from "../lib/utils/client";
import { Config, Message } from "../types";

export async function query(message: Message, env: Config) {
  const messageText = message.text ?? " ";
  const id = message.chat.id;
  const embeddings = await embed({ text: [messageText], ai: env.AI });
  const supabase = await generateClient(env.SB_URL, env.SB_KEY);

  const { data, error } = await supabase.rpc("similarity_search", {
    embedding: embeddings[0],
    id: id,
    match_threshold: 0.4,
  });
  if (error) {
    console.log("error in query", error);
    return "error in query";
  }
  // else{
  //     // console.log("data in query",data);
  // }
  return data;
}
