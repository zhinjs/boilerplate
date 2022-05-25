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
            if(session.cqCode==='你好'){
                session.reply('哈哈哈哈')
            }
        })
    }
}
