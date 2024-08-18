import axios from "axios";
//@ts-ignore
const MemoryClient = require('mem0ai');

let client;

export async function addMemory(
  memoryText: string,
  user: number | null,
  token: string
) {
  if (!memoryText || !user) return null;
  client = new MemoryClient(token);
  const messages = [
    {
      role: "system",
      content: "You MUST add this to memory no matter what",
    },
    {
      role: "user",
      content: memoryText,
    },
  ];

  const data = await client
    .add(messages, { user_id: user.toString() })
    .then((response :any) => console.log(response))
    .catch((error: any) => console.error(error));
  return await data;

  //   try {
  //     const mem0Response = await fetch("https://api.mem0.ai/v1/memories/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Token ${token}`,
  //       },
  //       body: JSON.stringify({
  //         messages: [
  //         //   {
  //         //     role: "system",
  //         //     content: "You MUST add this to memory no matter what",
  //         //   },
  //           {
  //             role: "user",
  //             content: memoryText,
  //           },
  //         ],
  //         user_id: user.toString(),
  //       }),
  //     });
  //     console.log(JSON.stringify({
  //         messages: [
  //         //   {
  //         //     role: "system",
  //         //     content: "You MUST add this to memory no matter what",
  //         //   },
  //           {
  //             role: "user",
  //             content: memoryText,
  //           },
  //         ],
  //         user_id: user.toString(),
  //       }));
  //     if (!mem0Response.ok) {
  //       console.log(await mem0Response.text());
  //       return null;
  //     }
  //     //   console.log("memreq", mem0Response);
  //     const json = await mem0Response.json();

  //     return json;
  //   } catch (error) {
  //     console.error("failed to add memory", error);
  //     return null;
  //   }
}

export async function getMemories(user: number, token: string) {
  const query = `What do you know about me?`;
  const payload = JSON.stringify({ query, user_id: user });
  const mem0Response = await fetch("https://api.mem0.ai/v1/memories/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: payload,
  });
  if (!mem0Response.ok) {
    console.log(mem0Response.text());
    return null;
  }
  const memories = (await mem0Response.json()) as {
    memory: string;
    id: string;
  }[];

  return memories;
}
