import {Context} from 'zhin';

export function install(ctx:Context){
    ctx.command('echo <var>')
        .action((_,msg)=>msg)
}