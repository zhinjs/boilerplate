# oitq 插件开发样例
1. 创建好仓库并clone 到本地后需要使用`npm install`安装项目依赖
2. 使用`npm start` 启动项目，首次启动会自动创建配置文件
3. 使用`ctrl+C` 关闭项目，将配置文件`zhin.yaml`中的`uin`、`platform`、`password`更改成自己的机器人信息
4. (可选) 如果命令行出现验证信息，可在配置文件中的`plugins`中添加`login`配置，表示启用login插件，该插件可帮助你在命令行完成验证
- 完成上述步骤后可直接使用`npm start`启动你的机器人
## other
- 由于log4js版本问题，默认配置文件可能会出现日志打印重复问题，你可将配置文件logConfig中的  `categories` 的`consoleOut`解决日志重复问题
