import { createClient } from '@supabase/supabase-js'
import { Config } from "../../types";


export async function generateClient(SB_URL: string, SB_KEY: string) {
    const supabase = createClient(SB_URL, SB_KEY);
    return supabase;
}