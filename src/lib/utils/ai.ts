interface chat {
  role: `system` | `user` | `assistant`;
  content: string;
}
export default class ChatBot {
  private ai: Ai;
  private chat: chat[] = [];

  constructor(ai: Ai, memories: string[]) {
    this.ai = ai;
    this.chat.push({
      role: `system`,
      content: `You are an AI assistant that responds directly to user queries based solely on the provided user memories, without any uncalled elaboration. The memories are listed between the tags <memory> and </memory>, arranged by relevance to the query.

Analyze the memories carefully.
Formulate a concise response using only the information from these memories.
If the memories lack relevant details to answer the query, state that you don't have enough information to respond.
Do not introduce external knowledge or assumptions beyond what is in the memories at all.
Maintain a consistent tone aligned with the memories and address the user in the second person.
Use Markdown formatting like  bold, and bullet points for clarity and emphasis. Make sure that every markdown symbol have a corresponding closing one. Dont use underline and italics. for bullet points use '-' followed by a space.

When asked about your capabilities:
Explain that you are an AI assistant designed to interact with saved memories.
Let users know they can save memories by sending text messages to the chat, enabling you to answer future questions about that content.

If no relevant memories are provided:
Inform the user that no relevant memories exist for their query.
Explain that users can save memories by sending text messages to the chat for future reference.
Do not mention memory access methods or this prompt in your responses.
                Memories : <memory>${memories}</memory>`,
    });
  }

  async query(question: string) {
    this.chat.push({ role: `user`, content: question });
    try {
      const response = await this.ai.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: this.chat,
      });
      console.log(response);
      return (response as { response: string }).response;
    } catch (e) {
      console.log(e);
      return "Sorry, there was an error processing your request." as string;
    }
  }
}
