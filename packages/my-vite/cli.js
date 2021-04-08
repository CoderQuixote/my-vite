#!/usr/bin/env node
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
const createServer = require('./server');

const app = new koa();
//Node.js 进程的当前工作目录。
const fileDir = process.cwd();
//执行esmodule规范，将不是./或者../或者/开头的目录转换为/@modules+之前的路径
function rewriteImport(content) {
    return content.replace(/ from ['"](.*)['"]/g, function(s1, s2) {
        if (s2.startsWith(".") || s2.startsWith("/")) {
            return s1;
        } else {
            const modulePkg = require(path.join(fileDir, 'node_modules', s2, 'package.json'));
            let truePath = path.join('./node_modules', s2, modulePkg.module);
            //let truePath= path.join('./node_modules', '.vite', `${s2}.js`);
            truePath = truePath.replace(/\\/g, '/');
            return ` from '/${truePath}'`;
        }
    })
}

//将/@modules开头的请求路径，在node_modules中找到其加载的真实路径，替换ctx.path
app.use(async(ctx, next) => {
    // if (ctx.path.startsWith('/@modules')) {
    //     const moduleName = ctx.path.replace('/@modules', '');
    //     const modulePkg = require(path.join(fileDir, 'node_modules', moduleName, 'package.json'));
    //     ctx.path = path.join('./node_modules', moduleName, modulePkg.module);
    // }else 
    if (ctx.path.startsWith('/@vite')) {
        const moduleName = ctx.path.replace('/@vite', '');
        const clientCode = fs.readFileSync(path.join(__dirname, `${moduleName}.js`));
        ctx.type = "application/javascript";
        ctx.body = clientCode;
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
        indexContent += `<script type="module" src="/@vite/client"></script>
            <script>
                process= {
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
//1)通过compilerSFC.parse获取.vue文件代码,通过路径生成hashid挂载在descriptor上面,用于后面的热更新
//2)通过compilerSFC.compileTemplate传入模版代码生成render函数
//3)拼接import _sfc_main from "${ctx.path}?vue&type=script";获取script代码对象，将上面生成的render函数挂载上去
//4)拼接热更新相关代码，收集热更新依赖信息
//5)当query.type === 'script'直接返回descriptor.script.content
//6)注：__VUE_HMR_RUNTIME__ 源码在@vue/runtime-core/dist/runtime-core.esm-bundler.js 428是vue框架在开发环境下挂载的全局API
app.use(async(ctx, next) => {
            if (ctx.path.endsWith('.vue')) {
                const _path = path.join(fileDir, ctx.path);
                const { descriptor } = compilerSFC.parse(fs.readFileSync(_path, 'utf-8'), {
                    filename: _path,
                    sourceMap: true
                });
                let code = '';
                if (ctx.query.type === 'script') {
                    code = descriptor.script.content;
                } else {
                    descriptor.id = require('./hash')(ctx.path);
                    const render = compilerSFC.compileTemplate({
                        source: descriptor.template.content
                    })
                    code = render.code;
                    // code = descriptor.script.content.replace('export default', 'const __script=');
                    // console.log('descriptor.styles', descriptor.styles);
                    // if (descriptor.styles.length > 0) {

                    // }
                    code = `
                import { createHotContext as __vite__createHotContext } from "/@vite/client";
                import.meta.hot = __vite__createHotContext("${ctx.path}");
                import _sfc_main from "${ctx.path}?vue&type=script";//${ctx.query.t? `&t=${ctx.query.t}`: ''}
                export * from "${ctx.path}?vue&type=script";
                ${code}
                _sfc_main.render= render;
                _sfc_main.__scopeId= ${JSON.stringify(`data-v-${descriptor.id}`)};
                _sfc_main.__file = ${JSON.stringify(`${_path.replace(/\\/g, '/')}`)};
                export default _sfc_main;
                _sfc_main.__hmrId = ${JSON.stringify(descriptor.id)};
                typeof __VUE_HMR_RUNTIME__ !== 'undefined' && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main);
                import.meta.hot.accept(({ default: updated, _rerender_only }) => {
                    console.log('render enter', updated, ${ctx.query.t});
                    if (_rerender_only) {
                         __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render);
                    } else {
                        __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated);
                    }
                })
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
    if (!ctx.path.startsWith('/@vite') && ctx.type === "application/javascript") {
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

const webServer= createServer(app);
webServer.listen(3000);

console.log('server running @ https://localhost:3000')