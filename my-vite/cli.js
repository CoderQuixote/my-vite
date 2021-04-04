/*
 * @Descripttion: my vite
 * @version 1.0.0
 * @Author: cfwang 
 * @Date: 2021-04-04 17:33:25 
 */
console.log('my-vite');
const koa = require('koa');
// const send = require('koa-send');
const path = require('path');
const fs = require('fs');
//vue compiler-sfc 
//compilerSFC.parse获取代码字符串 
//compilerSFC.compileTemplate生成render函数
const compilerSFC = require('@vue/compiler-sfc');
const app = new koa();
//Node.js 进程的当前工作目录。
const fileDir = process.cwd();

//执行esmodule规范，将不是./或者../或者/开头的目录转换为/@modules+之前的路径
function rewriteImport(content) {
    return content.replace(/ from ['"](.*)['"]/g, function(s1, s2) {
        if (s2.startsWith(".") || s2.startsWith("/")) {
            return s1;
        } else {
            return ` from '/@modules/${s2}'`;
        }
    })
}

//将/@modules开头的请求路径，在node_modules中找到其加载的真实路径，替换ctx.path
app.use(async(ctx, next) => {
    if (ctx.path.startsWith('/@modules')) {
        const moduleName = ctx.path.replace('/@modules', '');
        const modulePkg = require(path.join(fileDir, 'node_modules', moduleName, 'package.json'));
        ctx.path = path.join('./node_modules', moduleName, modulePkg.module);
    }
    await next();
})

//加载首页文件index.html
app.use(async(ctx, next) => {
    //ctx.path http://localhost:3000 index.html
    // await send(ctx, ctx.path, {
    //     //设置工作目录为查找文件夹
    //     root: fileDir,
    //     //设置查找文件
    //     index: 'index.html'
    // })
    if (ctx.path === '/') {
        const _path = path.join(fileDir, 'index.html');
        let indexContent = fs.readFileSync(_path, 'utf-8');
        indexContent += `<script>
                process = {
                    env: {
                        NODE_ENV: 'development'
                    }
                }
            </script>`;
        ctx.body = indexContent;
        ctx.type = 'text/html; charset=utf-8';
    }
    await next();
})

//解析.vue文件
//1)将script里面的内容修改后直接返回
//2)修改的内容添加import {render as __render} from "${ctx.path}?type=template"
//3)处理当ctx.query.type === 'template'时将template内容通过@vue/compiler-sfc模块的compileTemplate方法生成render函数并返回code
app.use(async(ctx, next) => {
    if (ctx.path.endsWith('.vue')) {
        const _path = path.join(fileDir, ctx.path);
        const { descriptor } = compilerSFC.parse(fs.readFileSync(_path, 'utf-8'));
        let code = '';
        if (ctx.query.type === 'template') {
            const render = compilerSFC.compileTemplate({
                source: descriptor.template.content
            })
            code = render.code;
        } else {
            code = descriptor.script.content.replace('export default', 'const __script=');
            code += `
                import {render as __render} from "${ctx.path}?type=template"
                __script.render=  __render;
                export default __script;
            `
        }
        ctx.type = "application/javascript";
        ctx.body = code;
    }
    await next();
})


//当请求文件是.ts或者.js时添加content-type为application/javascript
app.use(async(ctx, next) => {
    if (ctx.path.endsWith('.ts') || ctx.path.endsWith('.js')) {
        ctx.type = "application/javascript";
    }
    await next();
})

//当文件中的文件导入方式不符合esmodule规范时，调用rewriteImport修改请求路径
app.use(async(ctx, next) => {
    if (ctx.type === "application/javascript") {
        if (ctx.path.endsWith('.vue')) {
            ctx.body = rewriteImport(ctx.body);
        } else {
            const _path = path.join(fileDir, ctx.path);
            let _content = fs.readFileSync(_path, 'utf-8');
            ctx.body = rewriteImport(_content);
        }
    }
    await next();
})

app.listen(3000);
console.log('server running @ http://localhost:3000')