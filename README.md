## 项目说明

# 开发

## 命名规范

- 所有的组件首字母大写
- 所有的页面仅导出一个default函数组件，且文件名必须和组件名一致（否则hmr会失效）
- 所有的页面组件必须放在`src/pages`目录下
- 所有的可重用组件集合不应该导出default，应该导出多个组件、type、interface、常量等
- 所有的可重用组件必须导出default，可以导出多个type、interface、常量等
- 所有的可重用组件必须放在`src/components`目录下

## import规范

@mui/icons-material虽然支持摇树优化，但是由于它的图标太多了，如果从index中引入图标，会导致vite扫描所有的图标代码，导致编译时间过长，所以请直接从`@mui/icons-material/图标名`引入

## UI规范

尽量使用`@mui/joy`中的组件，对于没有的组件，可以用`@mui/material`代替，颜色已经统一，不需要再自己定义颜色

### 颜色使用

所有容器和容器内组合组件请使用neutral（是默认的），需要从主题中区分出的重要操作组件请使用primary

## 安装依赖

```bash
yarn
```

## 启动开发服务器

```bash
yarn start
```

## 构建生产版本

```bash
yarn build
```
