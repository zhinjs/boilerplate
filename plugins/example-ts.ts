import {Plugin} from "oitq";
export function install(plugin:Plugin){
    // 定义指令
    plugin.command('打印 [message:text]','message')
        .desc('我是js的样例指令')
        .action((_,message)=>{
            return message
        })
    // 监听事件
    plugin.on('bot.message',session => {
        if(session.cqCode==='hello'){
            session.reply('你好？？')
        }
    })
}
