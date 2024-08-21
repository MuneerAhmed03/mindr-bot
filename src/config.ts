import {Config} from "./types"

let config : Config | null = null;

export function initConfig(env:Config){
    console.log(env);
    config = env;
}
export function getConfig(){
    if(!config){
        throw new Error("Config not initialized");
    }
    return config;
}