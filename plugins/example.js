module.exports = {
    install(plugin) {
        // 定义指令
        plugin.command('录入信息', 'message')
            .desc('prompt样例')
            .action(async ({session}) => {
                const result=await session.prompt([
                    {
                        type:'text',
                        name:'name',
                        message:'请输入用户名',
                    },
                    {
                        type:'number',
                        name:'age',
                        message:'请输入年龄'
                    },
                    {
                        type:'select',
                        name:'sex',
                        message:'请选择性别',
                        choices:[{title:'男',value:'male'},{title:'女',value:'female'}]
                    }
                ])
                return ['你录入的信息为：\n',JSON.stringify(result,null,2)]
            })
        // 监听事件
        plugin.on('bot.message',(session) => {
            console.log(session.message)
            if(session.cqCode==='你好'){
                session.reply('哈哈哈')
            }
        })
        // 扫码登陆
        plugin.on('bot.system.login.qrcode',(session) => {
            console.log('请扫码后按回车继续')
            process.stdin.on('data',()=>session.bot.login())
        })
        // 滑块验证
        plugin.on('bot.system.login.slider',(session) => {
            console.log('请输入滑块验证的ticket：')
            process.stdin.on('data',(ticket)=>{
                session.bot.submitSlider(ticket.toString())
                session.bot.login()
            })
        })
        // 设备验证
        plugin.on('bot.system.login.device',(session) => {
            console.log('请输入手机收到的验证码：')
            process.stdin.on('data',(sms)=>{
                session.bot.submitSmsCode(sms.toString())
                session.bot.login()
            })
        })
    }
}
