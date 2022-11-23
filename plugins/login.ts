import {Plugin,Bot} from "zhin";
export function install(this:Plugin,bot:Bot){
    bot.on('system.login.slider',(e)=>{
        console.log('输入滑块地址获取的ticket后继续。\n滑块地址:    '+e.url)
        process.stdin.once('data',(data)=>{
            bot.submitSlider(data.toString().trim())
            console.log('到这儿')
            bot.login()
        })
    })
    bot.on('system.login.qrcode',(e)=>{
        console.log('扫码完成后回车继续:    ')
        process.stdin.once('data',()=>{
            bot.login()
        })
    })
    bot.on('system.login.device',(e)=>{
        console.log('请输入密保手机收到的验证码:')
        bot.sendSMSCode()
        process.stdin.once('data',(data)=>{
            bot.submitSMSCode(data.toString().trim())
            bot.login()
        })
    })
}