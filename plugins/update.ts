import {Bot} from "zhin";
export function install(this:Bot.Plugin,bot:Bot){
    bot.command('update [name:string]','all')
        .desc('更新指定插件')
        .action((argv, name)=>{

        })
}