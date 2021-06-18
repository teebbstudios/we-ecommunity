# 至文掌上社区系统小程序端
至文掌上社区系统充分利用移动互联网的便利优势，以“微信小程序”的形式为社区居民提供一个便利的社区服务平台。系统以满足社区居民的需求为落脚点，以信息技术手段为支撑，是一个集住户管理、在线社区服务、社区通知等功能于一体的智能化综合社会信息服务管理平台。

![掌上社区小程序](./readme/image.jpg)

小程序端开源，仍有许多代码优化空间，可供您学习参考，欢迎Fork。  
服务器端可提供源代码和服务器托管，为收费服务，如有需要联系微信/QQ:443580003。

## 系统主要功能 

1. 家庭、住户信息管理
> 通过住户登记对家庭、住户信息进行全方位管理。可对家庭、家庭成员添加自定义标记，快速检索特定家庭，特定住户信息。 

2. 社区事项全面展示 
> 社区办事指南、社区通知、社区各项动态通过小程序全面展示， 居民可及时查询、查看最新政策及各项事务。

3. 社区通知、活动精准传达
> 借助微信平台，社区通知、各项活动可精准传达给社区已登记住户或特定住户，住户不再错过各项重要通知及活动。

4. 在线预约办理业务 
> 社区住户可在线预约办理各项业务。预约办理申请准确及时通知到工作人员进行处理。真正实现“信息多跑路，群众少跑路”。

5. 意见建议反馈
> 住户可对社区生活中多项问题及其他建议进行在线提交，工作人员及时进行督促与改进，让住户幸福感、满意度提升。

6. 社区宣传提升幸福感 
>“幸福家园”栏目，可以对于社区住户各类好人好事进行宣传。增进邻里关系，促进和谐社区发展，提升幸福感。

## 使用说明
1. 使用`git clone`命令下载库 
2. 修改`project.config.json`中appid为您自己的小程序ID
3. 修改`config/api.js`文件`apiHost`API主机地址
4. 修改`config/templates.js`文件中订阅消息模板ID，模板名称及模板中的项目要与文档说明保持一致（http://ec.teebb.com/tech/miniprogram-template-ids.html）
5. 后续更新使用`git pull`命令进行更新，并修改前4条中的文件