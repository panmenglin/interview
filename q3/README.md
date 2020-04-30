# AutoComplete

输入框自动完成功能。

---
## 项目启动

安装依赖
```
yarn install / npm install
```

启动项目
```
npm run start
```


## 使用方法

```javascript
import AutoComplete from <AutoCompletePath>

 <AutoComplete
    onSearch={searchFun}
    onChange={changeFun}
    onSelect={selectFun}
    options={options}
    placeholder={locale<placeholder>}
    style={style}
></AutoComplete>
```


## API

参数 | 说明 |  类型  
-|-|-
placeholder | 输入框提示 | string |
options | 下拉选项 | [{label: string \| ReactNode, value: string, [proppName:string]: any}] |
style | 容器样式 | React.CSSProperties |
onSearch | 搜索补全项的时候调用 | function(value) |
onChange | input 的 value 变化时调用 | function(value) |
onSelect | 被选中时调用 | function(value, option) |


## 主题

通过修改 .umirc.ts 中 theme 配置覆盖主题样式
