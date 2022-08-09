import {Plugin, App, PluginMiddleware} from "oitq";
export const changeOitqConfig:PluginMiddleware=(plugin:Plugin)=>{
    plugin.command('admin/config/oitq [key:string] [value]','all')
        .desc('更改配置文件')
        .option('delete','-d 删除指定key值')
        .auth(4)
        .action(async ({session,options},key,value)=>{
            const keys:string[]=[]
            if(key)keys.push(...key.split('.'))
            let currentValue:any=App.readConfig(process.env.configPath)
            let rootData=currentValue
            let pre=currentValue
            function protectedPassword(value:string|object){
                if(!value || typeof value!=='object') return value
                if(Array.isArray(value)) return value.map(protectedPassword)
                return Object.fromEntries(Object.keys(value).map(key=>[key,key==='password'?String(value[key]).replace(/./g,'*'):protectedPassword(value[key])]))
            }
            let k
            while (keys.length){
                k=keys.shift()
                if(!currentValue[k] && keys.length)currentValue[k]={}
                if(currentValue===undefined && keys.length)return `未找到oitq.${key}`
                pre=currentValue
                currentValue=currentValue[k]
            }
            if(options.delete && k){
                delete pre[k]
                await App.writeConfig(rootData,process.env.configPath)
                return '删除成功'
            }
            if(value===undefined){
                if(currentValue===undefined)return `未找到oitq.${key}`
                return JSON.stringify(protectedPassword(currentValue),null,4).replace(/"/g,'')
            }
            try{
                value=JSON.parse(value)
            }catch {}
            pre[k]=value
            await App.writeConfig(rootData,process.env.configPath)
            return '修改成功'
        })
}
export default changeOitqConfig