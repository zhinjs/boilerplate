import {Bot} from "zhin";
import {segment,Forwardable} from 'oicq'
export interface RecallConfig {
    recall?: number
}

export interface Respondent {
    match: string | RegExp
    reply: string | ((...capture: string[]) => string)
}
function getChannelId(event){
    return [event.message_type,event.group_id||event.discuss_id||event.user_id].join(':')
}
export interface BasicConfig extends RecallConfig {
    echo?: boolean
    send?: boolean
    github?: boolean
    feedback?: number | number[]
    respondent?: Respondent | Respondent[]
}
export function echo(bot: Bot) {
    bot.command('common/echo <varName:string>')
        .desc('输出当前会话中的变量值')
        .action(async ({event}, varName) => {
            let result: any = event
            if (!varName) return '请输入变量名'
            if (varName.match(/\(.*\)/) && !bot.isMaster(event.user_id)) return `禁止调用函数:this.${varName}`
            let varArr = varName.split('.')
            if (!bot.isMaster(event.user_id) && varArr.some(name => ['options', 'bot', 'app', 'config', 'password'].includes(name))) {
                return `不可达的位置：${varName}`
            }
            try {
                const func = new Function(`return this.${varArr.join('.')}`)
                result = func.apply(event)
            } catch (e) {
                if (result === undefined) e.stack = '未找到变量' + varName
                throw e
            }
            if (result === undefined) throw new Error('未找到变量' + varName)
            return JSON.stringify(result, null, 4).replace(/"/g, '')
        })
}

export function send(bot: Bot) {
    bot.command('common/send <message:text>')
        .desc('向当前上下文发送消息')
        .option('user', '-u [user:number]  发送到用户')
        .option('group', '-g [group:number]  发送到群')
        .option('discuss', '-d [discuss:number]  发送到讨论组')
        .action(async ({event, options}, message) => {
            if (!message) return '请输入需要发送的消息'
            if (options.user) {
                await bot.sendPrivateMsg(options.user, message)
                return true
            }
            if (options.group) {
                await bot.sendGroupMsg(options.group, message)
                return true
            }
            if (options.discuss) {
                await bot.sendDiscussMsg(options.discuss, message)
                return true
            }
            await event.reply(message)
            return true
        })
}


export function feedback(bot: Bot, {
    operators
}: { operators: number[]}) {
    async function createReplyCallback(bot,event, user_id) {
        const dispose=bot.middleware((message)=>{
            if(message.message_type==="private" && message.user_id===user_id){
                event.reply(['来自作者的回复：\n', ...event.message], true)
                dispose()
            }
        })
    }

    bot.command('common/feedback <message:text>')
        .desc('发送反馈信息给作者')
        .action(async ({event}, text) => {
            if (!text) return '请输入反馈消息'
            const name = event.sender['card'] || event.sender['title'] || event.sender.nickname || event.nickname

            const fromCN = {
                group: () => `群：${event['group_name']}(${event['group_id']})的${name}(${event.user_id})`,
                discuss: () => `讨论组：${event['discuss_name']}(${event['discuss_id']})的${name}(${event.user_id})`,
                private: () => `用户：${name}(${event.user_id})`
            }
            const message = `收到来自${fromCN[event.message_type]()}的消息：\n${text}`
            for (let index = 0; index < operators.length; ++index) {
                const user_id = operators[index]
                await bot.sendPrivateMsg(user_id, message)
                createReplyCallback(bot,event, user_id)
            }
            return '反馈成功'
        })
}


export function basic(bot: Bot, config: BasicConfig = {feedback: []}) {
    if(!config) config={}
    if (config.echo !== false) bot.plugin(echo)
    if (config.send !== false) bot.plugin(send)
}

export function github(bot: Bot) {
    bot.middleware((session) => {
        const mathReg = /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+)\/?$/
        const match = session.toCqcode().match(mathReg)
        if (!match) return
        const [, owner, repo] = match
        const url = `https://opengraph.github.com/repo/${owner}/${repo}`
        return segment.image(url)
    })
}

export interface Config extends BasicConfig {
    name?: string
}

export function install(bot: Bot, config: Config={}) {
    bot.command('common')
        .desc('基础功能')
    bot.command('common/segment')
        .desc('生成指定消息段内容')
    if (config && config.github !== false) bot.plugin(github)
    bot.command('common/segment/face <id:integer>')
        .desc('发送一个表情')
        .action((_, id) => segment.face(id))
    bot.command('common/segment/image <file>')
        .desc('发送一个一张图片')
        .action((_, file) => segment.image(file))
    bot.command('common/segment/at <qq:integer>')
        .desc('发送at')
        .action((_, at) => segment.at(at))
    bot.command('common/segment/dice [id:integer]')
        .desc('发送摇骰子结果')
        .action((_, id) => segment.dice(id))
    bot.command('common/segment/rps [id:integer]')
        .desc('发送猜拳结果')
        .action((_, id) => segment.rps(id))
    bot.command('common/segment/poke')
        .desc('发送戳一戳【随机一中类型】')
        .action((_, qq) => segment.poke(parseInt((Math.random() * 7).toFixed(0))))
    bot.command('common/segment/fake [user_id:qq] [message]')
        .desc('制作假的合并消息')
        .action(async ({event, options}, user_id, message) => {
            if(!message || !user_id) return 'message and user_id is required'
            const messageArr:Forwardable[]=[]
            if(message && user_id) messageArr.push({
                message,
                user_id,
                nickname:(await bot.pickUser(user_id).getSimpleInfo()).nickname
            })
            let finished=true
            return await bot.makeForwardMsg(messageArr)
        })
    bot.plugin(basic, config)
    bot.plugin('common/music')

}
