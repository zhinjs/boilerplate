import {Plugin,PluginMiddleware} from "oitq";
import changeOitqConfig from './oitq'
export const changeConfig:PluginMiddleware=(plugin:Plugin)=>{
    plugin.command('admin/config','all')
        .desc('更改配置')
    plugin.plugin(changeOitqConfig)
}
export default changeConfig