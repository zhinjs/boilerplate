const {createWorker,defineConfig} = require('zhin')
const config=defineConfig({
    uin:210723495,
    platform:5,
    data_dir:process.cwd()+'/data',
    plugin_dir:'plugins',
    plugins:{
        watcher:null
    }
})
createWorker(config)
