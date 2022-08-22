import {Bot} from "zhin";
import Koa from 'koa'
import {Server} from "http";
import {Router} from "./router";

declare module 'zhin'{
    interface Bot {
        server:Server
        koa:Koa,
        router:Router
    }
}
export function install(bot:Bot){

}