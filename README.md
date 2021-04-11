# 关键字 lerna vite vue3
## 目录介绍
* packages/my-vite vite代码
* packages/vue-app为vue3.0
## 项目运行
``` 
//shell
yarn dev

//yarn config
sass-binary-site "http://npm.taobao.org/mirrors/node-sass"
strict-ssl false
```
**下载依赖失败时可以直接解压node_modules.zip**
---
**packages/vue-app/package.json 配置下的scripts.dev 为vite或者my-vite切换使用官方的vite还是我们自己写的vite**
