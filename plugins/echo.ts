import {OitqPlugin} from "oitq";
const plugin=new OitqPlugin('echo',__filename)// 定义指令
    plugin.command('echo [message:text]','all')
        .desc('我是ts的样例指令')
        .action((_,message)=>{
            return message
        })
