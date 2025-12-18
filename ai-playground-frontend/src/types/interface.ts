export interface Project{
    id:number;
    name:string;
    description?:string;
}

export interface Chat{
    id:number;
    name:string;
    description?:string;
    bot_provider:string;
}

export interface Message{
    user:string;
    bot:string;
}