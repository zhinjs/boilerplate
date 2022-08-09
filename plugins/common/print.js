const {Plugin} = require("oitq");

const plugin = new Plugin('common', __filename)
plugin.command('print <msg:text>', 'all')
    .desc('打印一条消息')
    .action((_, msg) => {
        return msg
    })

