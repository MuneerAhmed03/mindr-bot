
interface chat {
    role : `system` | `user` | `assistant`;
    content : string;
}
interface AiTextGenerationOutput {
    response: string;
}
export default class ChatBot {
    private ai : Ai;
    private chat : chat[] = [];
    
    constructor(ai : Ai,memories :string[]){
        this.ai = ai;
        this.chat.push(
            {
                role : `system`,
                content : `You are an AI assistant designed to directly respond to user queries based exclusively on the provided user memories without excessive elaboration. Your responses should be tailored to reflect only the information contained within these memories. A list of memories enclosed  within the following tags: <memory> </memory> arranged in decreasing order of their relevance to the user query is provided to you.
                Analyze the given user memories carefully.
                Formulate your summarised direct response in your words to user query using only the information from the provided memories.
                If the memories do not contain relevant information to answer the query, state that you don't have enough information to respond accurately.
                Do not introduce any external knowledge or make assumptions beyond what is explicitly stated in the memories.
                Maintain a consistent personality and tone that aligns with the content of the memories.
                If asked about your capabilities or the source of your knowledge, explain that you are an AI assistant working with a specific set of the user memories.
                Use Markdown formatting in your answer, including bold, italics, and bullet points as appropriate to improve readability and highlight key points.
                If no context is provided, introduce yourself and explain that the user can save memories bye which will allow you to answer questions about that content in the future. Do not provide an answer if no context is provided.
                Memories : <memory>${memories}</memory>`,
            }
        )
    }

    async query (question:string){
        this.chat.push({role : `user`,content : question});
        try{
            const response = await this.ai.run("@cf/meta/llama-3.1-8b-instruct", {messages : this.chat});
            console.log(response);
            return (response as { response: string }).response
        }catch(e){
            console.log(e);
            return 'Sorry, there was an error processing your request.' as string;
        }
    }
}