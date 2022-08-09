import {Plugin} from "oitq";
import '@oitq/service-database'
import {QA} from "./models";
import teach from './teach'
import receiver from './receiver'
const plugin=new Plugin('qa',__dirname)
plugin.using(['database'],(p)=>{
    p.app.database.define('QA',QA)
    p.plugin(teach)
    p.plugin(receiver)
})