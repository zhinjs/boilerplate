import {App, Plugin} from "oitq";
function showPlugins(app:App){
    return '已有插件如下：\n'+Object.keys(app.plugins).map(k=>`  ${k}`).join('\n')
}
export function managePlugin(plugin:Plugin){
    plugin.command('admin/plugin [name:string]',"all")
        .desc('管理插件')
        .option('list','-l 显示插件列表')
        .option('start','-s 加载插件')
        .option('dispose','-d 卸载插件')
        .action(({options},name)=>{
            console.log(options)
            if(Object.keys(options).length===0)options.list=true
            if(Object.keys(options).length>1) return '仅能使用一个选项'
            switch (Object.keys(options)[0]){
                case 'list':
                    return showPlugins(plugin.app)
                case 'start':
                    plugin.app.unload(name,'plugin')
                    return '已卸载'+name
                case 'dispose':
                    plugin.app.load(name,'plugin')
                    return '已加载'+name
            }
        })
}