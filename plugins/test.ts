import {Bot} from "zhin";
export const name='test'
export function install(bot:Bot){
    bot.command('test','all')
        .action(()=>{
            bot.sendPrivateMsg(1659488338,"I'm test")
            bot.on('message',(e)=>{})
        })
}