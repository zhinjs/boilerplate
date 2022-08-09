import {Plugin} from "oitq";
import type{} from '@oitq/service-database'
import {changeConfig} from './config'
import {managePlugin} from "./pluginMange";

const plugin = new Plugin('oitq',__dirname)

plugin.command('admin','all')
    .desc('管理机器人')
plugin.plugin(changeConfig)
plugin.plugin(managePlugin)
plugin.using(['database'],(plugin)=>{
    plugin.command('admin/ignore <...users:qq>','all')
        .desc('忽略某人的消息')
        .auth(4)
        .option('cancel','-c 取消忽略')
        .option('list','-l 显示目前忽略的用户列表')
        .action(async ({session,options},...users)=>{
            if(options.list){
                return '当前忽略的用户有：'+(await plugin.app.database.model('User').findAll({where:{ignore:true}}))
                    .map(_=>_.toJSON())
                    .map(u=>{
                        return u.user_id
                    }).join(',')
            }
            await plugin.app.database.model('User').update({ignore:!options.cancel},{
                where:{
                    user_id:users
                }
            })
            return '已完成你的操作'
        })
})