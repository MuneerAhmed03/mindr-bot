import { Hono } from 'hono'
import {Config} from "../types"
import { embed } from '../lib/utils/embed';


const memoryRouter = new Hono<{Bindings : Config}>();

memoryRouter.get("/",async (c)=>{
    return c.text("Hello from memory");
});

memoryRouter.post('/embed', async (c)=>{
    const {text} = await c.req.json();
    const embeddings = await embed({text:text,ai:c.env.AI});
    return c.json(embeddings);
})



export default  memoryRouter;