# admin
### 前言
自己一直想做个包括前后端的项目，了解和熟悉一个网站从构建到部署整个流程。正好以前做过一个react的[后台模板（纯前端）](https://blog.csdn.net/qq_37860930/article/details/81327320)。另外在慕课网找了一个node项目学习后，开始自己做一个前后台项目。

所有权限都在后台做，比如非管理员不能添加和删除作品，如果仅靠前台禁用按钮，用户可以直在浏览器修改dom属性绕过禁用功能，所以前台只是起对不同权限用户展示不同UI的功能，而不是通过前台做权限功能。

想测试多个账号在线，请用不同的浏览器登陆

**项目地址**：[github地址](https://github.com/zhangZhiHao1996/admin)  
**预览地址**：服务器到期，暂时没有预览地址
<br/>



### 1.项目截图
![在这里插入图片描述](https://github.com/zhangZhiHao1996/image-store/blob/master/admin/01.png?raw=true)
![在这里插入图片描述](https://github.com/zhangZhiHao1996/image-store/blob/master/admin/02.png?raw=true)
![在这里插入图片描述](https://github.com/zhangZhiHao1996/image-store/blob/master/admin/03.png?raw=true)
![在这里插入图片描述](https://github.com/zhangZhiHao1996/image-store/blob/master/admin/04.png?raw=true)

<br/>

### 2.项目功能
- [x] 用户注册功能
- [x] 用户登录功能
- [x] 修改账号信息上传头像等功能
- [x] 网站换肤、切换全屏功能
- [x] 网站留言板
- [x] 聊天室

[jwt实现注册与登陆系统](https://blog.csdn.net/qq_37860930/article/details/96145590)  
[react+koa实现留言板功能](https://blog.csdn.net/qq_37860930/article/details/96150575)  
[webSocket实现聊天室功能](https://blog.csdn.net/qq_37860930/article/details/96302728)  
[react编写打字组件](https://blog.csdn.net/qq_37860930/article/details/96285201)  
[antd实现换肤功能](https://www.jianshu.com/p/b635211658c8)  
[富文本编辑器braft-editor的使用](https://blog.csdn.net/qq_37860930/article/details/97115621)  

<br/>

### 3.前端
前端使用的技术栈：`react、react-router、redux、canvas、fetch、antd、websocket、es6`
<br/>

##### 3.1创建
使用`create-react-app`脚手架搭建了前端项目并扩展了webpack的配置（配置可以参考[这里](https://blog.csdn.net/qq_37860930/article/details/85162024)）。
新增修饰器语法，这是ES7的一个新语法，作用就是修改组件的一些属性。比如路由的withRouter将组件包裹，可以在组件的props上传递history对象等等。

```javascript
//不使用修饰器语法
withRouter(Test)

//使用修饰器语法
@withRouter
class Test extends React.Component{
	...
}
```
当有一个组件需要多个高阶组件包裹时，这种写法就很有优势

```JavaScript
withRouter(Form.create()(Test))

@withRouter @Form.create() ...
class Test extends React.Component{
	...
}
```
当然包裹的顺序也很重要

<br/>



##### 3.2依赖

 - 全屏插件[screenfull](https://github.com/sindresorhus/screenfull.js)
 - antd皮肤在线更换[antd-theme-generator](https://github.com/mzohaibqc/antd-theme-generator)

自己根据需求封装了一个fetch来进行前后台通信，使用简单。

```javascript
const res = await get('/test')
console.log(res)
```

##### 3.3组件
`公用组件`应该完全隔离`业务逻辑`，我通过事件分发和props传递编写了以下组件，这些组件完全隔离了业务逻辑，所以在其它项目中也可以使用。

组件     | 组件的作用 | 组件接收的props
-------- | ----- | -----
AnimatedBooks  | 展示翻书动画效果的组件 |  content(内容) 、cover(封面)
Background | 登录粒子背景 | url(背景图)
ColorPicker | 拾色器 | color(当前颜色)、onChange(颜色改变的函数)
Loading | loading动画 | 
Typing | 打字插件 |  delay(打印延时)、frequency(打印频率)、done(打印完成的回调)

##### 3.4页面
页面可以拆分成不同的组件，然后将组件拼接成一个页面，使得页面维护和编写变得简单。但是会带来不同组件之间通信的问题，解决的方法有两个：

 - 状态提升
 - 状态管理

`状态提升`适用于组件关系简单的通信，比如兄弟组件之间的通信，就可以将状态提升到它们的父组件中，通过props和事件传递给子组件。这种方式不适合层级结构太深的组件通信，否则一层层传递太过麻烦。

在Index页面中，我将页面按照UI拆分成了`头部、侧边栏、中间部分、底部`组件，然后使用了状态提升进行组件之间的通信。

`状态管理`适用于需要全局使用的状态或者组件嵌套复杂的状态，



至于如何拆分页面，我认为可以按**UI拆分**或**功能拆分**，如果拆分的组件可以共用，我们可以进一步抽象成公共组件使用（公共组件就是将业务逻辑解耦出去）

<br/>

### 4.项目后端
后端采用的是`koa、mysql`使用了一些koa的中间件
<br/>

##### 4.1创建
后端通过`koa-generator`脚手架搭建后端项目
这是我第一次写后端项目，对于后端的的`mvc`也不算特别熟悉，参考网上的介绍后以自己的理解去写了，routes文件存储路由、controller文件件实现对应的路由逻辑，如果有问题欢迎指出。

**为什么要使用框架？**
原生的`node`只提供了最基本的功能，我们还需要编写一些额外的代码才能达到我们的要求，比如获取前台传过来的参数，原生node只提供了url属性，需要我们自己解析url来获取querying，而`koa2`框架已经封装好了，直接在ctx中提供了query对象；还有前台post的数据、cookie、session、路由等，在原生中都需要我们自己处理，而`koa2`框架直接封装好了，就算`koa2`没有提供也有很多其他人编写好了的`中间件`供我们使用。

我认为使用的框架的意义就是编写更好可维护的代码，**减少和业务逻辑无关的代码**，比如解析前台参数、数据库连接等等重复的代码。

之所以用`koa2`而不用`express`是相较于promise我更喜欢async/await。


**接口规范**

当然也有很多方式定义状态码，只有自己写好文档即可。
```javascript
{
	"status":0,     //0代表成功,1失败
	"httpCode":200,    
	"message":"请求成功",
	"data":{}
}
```
<br/>

### 5.项目部署
##### 5.1项目打包
我将前端项目打包到node服务器上，
我想访问网址根目录就能直接访问项目首页了

```javascript
//app.js
app.use(views(__dirname + '/public/build'))   //这里的路径是前端项目打包后放在后端的位置

//routes ->index.js
router.get('/', async (ctx, next) => {
	await ctx.render('index.html')
})
```
由于我们前端使用的是HTML5的history，页面一刷新就404了，所以后端要配置。我使用了[koa-connect-history-api-fallback](https://github.com/davezuko/koa-connect-history-api-fallback)中间件来支持。
中间件实现的功能是如果 当URL 匹配不到任何静态资源，返回指定的页面（中间件默认返回的是index.html，配置参考[文档](https://github.com/bripkens/connect-history-api-fallback)）

```javascript
//app.js
const historyApiFallback = require('koa-history-api-fallback')
app.use(historyApiFallback());

```

这里要注意中间的顺序，historyApiFallback一定要放在所有接口路由后面，否则所有接口都是返回index.html了。
historyApiFallback一定要在静态资源前面，否则资源找不到

```javascript
//app.js
const historyApiFallback = require('koa-history-api-fallback')
// routes
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(works.routes(), works.allowedMethods())
app.use(message.routes(), message.allowedMethods())
app.use(score.routes(), score.allowedMethods())

app.use(historyApiFallback());

app.use(require('koa-static')(__dirname))
app.use(require('koa-static')(__dirname + '/public/build'))
app.use(require('koa-static')(__dirname + '/public/upload-files'))

```

另外项目用了jwt进行权限认证了，前端打包后的资源（css、js、图片等）这些资源不应该权限认证，否则401，前端获取不到这些js来生成页面了


上线时，创建数据报错`Unknown collation: 'utf8mb4_0900_ai_ci'`，我的数据库版本不支持这种格式。`SHOW COLLATION`,可查看数据库所有支持的collation，我将排序规则改为`utf8mb4_general_ci`
<hr/>





### 总结
期间遇见的问题我都是边找边学边用，磕磕绊绊完成了这个小项目。通过这个小项目，我熟悉了一个基本的网站从零到上线的整个流程，并从中发现问题、解决问题。这也是我写这个项目的初衷。我并没有过多深入每个细节，如数据库的字段设计，加密、防止mysql的注入、数据库优化等。




部署时，发现网页太慢了，查看network发现
用了nginx的gzip进行了压缩。
压缩前
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190715144426371.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3ODYwOTMw,size_16,color_FFFFFF,t_70)
压缩后
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190715144501968.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3ODYwOTMw,size_16,color_FFFFFF,t_70)
可以看到size明显变小了，但是请求的时间还是有点长
下面是我的nginx配置

```javascript
upstream admin{                                                                                                            
    server 47.99.130.140:8888;                                                                                             
}                                                                                                                          
upstream reactMusic{                                                                                                       
    server 47.99.130.140:8088;                                                                                             
}                                                                                                                          
                                                                                                                           
                                                                                                                           
                                                                                                                           
server{                                                                                                                    
     gzip on;                                                                                                              
     gzip_min_length 1k;                                                                                                   
     gzip_buffers 4 16k;                                                                                                   
     gzip_comp_level 6;                                                                                                    
     #gzip_types text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php;     
     gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/x
ml application/xml+rss text/javascript application/x-font-woff;                                                            
     gzip_http_version 1.1;                                                                                                
     gzip_vary on;                                                                                                         
     gzip_proxied off;                                                                                                     
                                                                                                                           
     listen 80;                                                                                                            
     server_name 47.99.130.140;                                                                                            
     location /admin/ {                                                                                                    
          proxy_redirect   off;                                                                                            
            proxy_set_header Host $host;                                                                                   
            proxy_set_header X-Forwarded-For $remote_addr;                                                                 
            proxy_set_header X-Real-IP $remote_addr;                                                                       
            proxy_pass http://admin/;                                                                                      
     }                                                                                                                     
     location /react-music/ {
                 proxy_set_header Host $host;                                                                              
            
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_set_header X-Real-IP $remote_addr;
                proxy_pass http://reactMusic/;   
     }

}                                                                                                        
                                                                           
                                                                           

```
