import {Plugin} from "oitq";
const adminPlugin=new Plugin('echo',__filename)
adminPlugin.command('echo [varName:string]','private')
    .desc('输出当前会话中的变量')
    .action(async ({session},varName)=>{
        let result: any = session
        if (!varName) return '请输入变量名'
        let varArr = varName.split('.')
        function protectedPassword(value:string|object){
            if(!value || typeof value!=='object') return value
            if(Array.isArray(value)) return value.map(protectedPassword)
            return Object.fromEntries(Object.keys(value).map(key=>[key,key==='password'?String(value[key]).replace(/./g,'*'):protectedPassword(value[key])]))
        }
        try {
            const func = new Function(`return this.${varArr.join('.')}`)
            result = func.apply(session)
        } catch (e) {
            if (result === undefined) e.stack = '未找到变量' + varName
            throw e
        }
        if (result === undefined) throw new Error('未找到变量' + varName)
        return JSON.stringify(protectedPassword(result), null, 4).replace(/"/g, '')
    })