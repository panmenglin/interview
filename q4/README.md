# 前端监控和上报

实现一个系统，统计前端页面性能、页面JS报错、用户操作行为、PV/UV、用户设备等信息，并进行必要的监控报警。方案你会如何设计，用什么技术点，什么样的系统架构，难点会在哪里等等，请描述你的思路。

---

前端监控通常分为采集、存储、上报、分析报警等4个阶段，具体如下

## 日志采集

日志采集主要包括环境信息、行为信息、性能数据、异常数据等4个方面

### 环境信息

通过 `navigator.userAgent` 可以获取用户的终端情况，操作系统信息、浏览器信息、网络类型等

通过 `window.screen` 获取用户屏幕分辨率

### 访问数据

获取访问的页面来源：

多页面可以获取 `document.referrer`，单页面的访问链路可以通过监听 `window.onpopstate` 和拦截 `pushState`、`replaceState` 来实现

通过 `window.location` 页面 `url` 信息和页面参数

页面加载记录访问次数，借助服务端获取用户 `ip` 确定 PV/UV

访问时长：

页面加载记录开始时间，监听 `beforeunload`、`unload`、`pagehide`、`visibilitychange`等事件用户离开时记录离开时间, 如果 `visibilityState` 变化但页面未关闭则将显示的时间累加

通过 `MutationObserver` 记录页面 `dom` 变化，重现用户操作

### 异常捕获

通过 `window.addEventListener('error')` 捕获资源加载异常：`js`、`css`、图片404等

通过 `window.onerror` 捕获 `js` 执行异常

通过 `window.addEventListener('unhandledrejection'）` 捕获没有处理 `reject`的 `promise` 异常

借助插件提供的拦截器捕获，例如 `aixos` 的 `interceptor`

借助框架提供的错误采集处理，例如 `vue` 的 `errorHandler`, `react` 的 `componentDidCatch`

重写类似的全局方法，例如全局的服务请求等

自定义异常捕获，包装提交异常的方法在 `try...catch...` 调用或其他合适的时机

### 性能数据

通过 `performance` 获取用户使用页面全过程的时间点，从而计算各过程的时间

DNS查询耗时 `domainLookupEnd - domainLookupStart`

TCP链接耗时 `connectEnd - connectStart`

request请求耗时 `responseEnd - responseStart`

解析dom树耗时 `domComplete - domInteractive`

白屏时间 `responseStart - navigationStart`

用户可操作时间节点 ：`domContentLoadedEventEnd - navigationStart`

总下载时间 ：`loadEventEnd - navigationStart`


## 日志存储

`IndexedDB` 相比 `localStorage` 或 `sessionStorage` 存储量更大，异步操作不会对界面的渲染产生阻塞，更适合做日志的数据管理，可以将日志进行分类存储，定时整理上报和过期清理

存储时短时间频发重复问题应过滤

可以在空闲时或上报时做统一整理和清洗


## 日志上报

### 上报方式

创建img标签，发送请求，服务端无需返回内容

`Ajax` 请求，同步 `Ajax` 会阻止页面 `unload`，异步的话在页面卸载时请求会丢失

`navigator.sendBeacon` 关闭页面异步发送请求，支持跨域

### 上报时机

上报时机需要根据监控数据紧急情况区分为：
即时上报、定时上报、根据行为上报，都需要以不阻塞渲染为原则异步处理

即时上报：严重影响用户行为，重大性能等问题
定时上报：普通报错，浏览链路，操作行为等
根据行为上报：访问时长，性能数据等可以在有计算值之后上报

## 分析报警

日志系统：
可能涉及可视化、数据脱敏、日志系统权限等
监控报告等


阈值和报警通知：
报警规则，数据阈值，通知人员和方式等
数据异常的预警，数据异常波动自动推送


## 问题和难点

由于网络、设备原因或监控代码本身引起的异常应予以合理过滤，避免造成不必要的问题

通过收集 `mutation` ，还原页面行为

可能存在 `api` 在部分浏览器的兼容性问题，例如 `performance API` 在古老浏览起可能无法收集时间，需要准备替代方案，例如侵入性的打点等

`js` 压缩混淆后的报错可能无法帮助工程师排查错误，需要在日志平台关联 `sourcemap` 获取源码具体信息

