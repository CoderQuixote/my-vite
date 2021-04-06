#目录介绍
*my-vite为手写vite代码
*vue-app为vue3.0练习代码
#项目运行
```
cd my-vite
npm i
//在本地nodejs安装目录下的node_modules生成my-vite的链接
npm link

cd ../vue-app
npm i
//在vue-app/node_modules下生成到node安装目录的node_modules/my-vite的链接
npm link my-vite
//运行
npm run dev
```
