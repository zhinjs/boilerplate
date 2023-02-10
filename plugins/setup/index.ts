import {useContext} from 'zhin';

const context=useContext()
context.command('hello')
.action(()=>'hi world')