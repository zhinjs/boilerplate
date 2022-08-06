const {OitqPlugin} = require("oitq");

const plugin = new OitqPlugin('common', __filename)
plugin.command('print <msg:text>', 'all')
    .desc('打印一条消息11111')
    .action((_, msg) => {
        return msg
    })
plugin.command('music <keyword:string>','all')
    .desc('搜索音乐')
    .desc('快捷方式：来一首 我想听 点歌')
    .shortcut(/^来一首(.+)$/,{args:['$1'],fuzzy:true})
    .shortcut(/^我想听(.+)$/,{args:['$1'],fuzzy:true})
    .shortcut(/^点歌(.+)$/,{args:['$1'],fuzzy:true})
    .option('platform','-p <platform:string> 音乐平台',{initial:'163'})
    .action(async ({options},keyword)=>{
        return `触发点歌，关键词：${keyword},所用平台：${options.platform}`
    })

