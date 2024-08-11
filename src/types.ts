export type Config= {
    TELEGRAM_BOT_TOKEN: string;
    MEM0_API_KEY: string;
    LLAMA_API_KEY: string;
  };

export type Message = {
  message_id : number,
  chat : Chat 
  date : number,
  text ?:string,
  entities ?: MessageEntity[],
  
}
export type Chat ={
  id:number,
  type : string,
}
export type MessageEntity={     
  type :string;
  offset: number;            
  length: number;           
  language?: string;        
  custom_emoji_id?: string;  
};