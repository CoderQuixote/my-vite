/*
 * @Descripttion: websocket client用于本地node服务和网页进行通讯
 * @version 1.0.0
 * @Author: cfwang 
 * @Date: 2021-04-05 22:15:25 
 */
let isFirstUpdate = true;
const base = "/" || '/';
const hotModulesMap = new Map();
let pending = false;
let queued = [];

const socket = new WebSocket("wss://localhost:3000", 'vite-hmr');
// Listen for messages
socket.addEventListener('message', async({ data }) => {
    handleMessage(JSON.parse(data));
})

async function handleMessage(payload) {
    switch (payload.type) {
        case 'connected':
            console.log('client ws connected');
            setInterval(() => socket.send('ping'), 30000);
            break;
        case 'update':
            // if (isFirstUpdate) {
            //     window.location.reload();
            //     return;
            // }else {
            //     isFirstUpdate = false;
            // }
            console.log('update11', payload.updates);
            // [{
            //     acceptedPath: "/src/App.vue",
            //     path: "/src/App.vue",
            //     timestamp: 1617763173350,
            //     type: "js-update"
            // }]
            payload.updates.forEach((update) => {
                if (update.type === 'js-update') {
                    queueUpdate(fetchUpdate(update));
                }
            });
            break;
    }
}


async function fetchUpdate({ path, acceptedPath, timestamp }) {
    //hotModulesMap里面查找页面注入createHotContext之后通过import.meta.hot.accept收集的路径和render函数信息
    const mod = hotModulesMap.get(path);
    if (!mod) {
        return;
    }
    const moduleMap = new Map();
    const isSelfUpdate = path === acceptedPath;
    const modulesToUpdate = new Set();
    if (isSelfUpdate) {
        modulesToUpdate.add(path);
    } else {
        for (const { deps }
            of mod.callbacks) {
            deps.forEach((dep) => {
                if (acceptedPath === dep) {
                    modulesToUpdate.add(dep);
                }
            });
        }
    }

    //在mod.callbacks中查找需要本次更新调用的callback
    // callbacks: [{
    //     deps: ['/src/App.vue'],
    //     fn: ([mod])=> cli注入render函数(mod)
    // }]
    const qualifiedCallbacks = mod.callbacks.filter(({ deps }) => {
        return deps.some((dep) => modulesToUpdate.has(dep));
    });

    //modulesToUpdate  ['/src/App.vue']
    //解析modulesToUpdate，链接上面添加时间戳重新发起模块请求获取到的newMod 存储在moduleMap里面
    await Promise.all(Array.from(modulesToUpdate).map(async(dep) => {
                    const [path, query] = dep.split(`?`);
                    try {
                        //newMod
                        // {
                        //     default: {...},
                        //     render: ()=>{...}
                        // }
                        const newMod = await
                        import (
                            /* @vite-ignore */
                            base +
                            path.slice(1) +
                            `?import&t=${timestamp}${query ? `&${query}` : ''}`);
            console.log('newMod0000000', newMod);
            moduleMap.set(dep, newMod);
        }
        catch (e) {
            warnFailedFetch(e, dep);
        }
    }));
    return () => {
        //qualifiedCallbacks
        //[{
        //     deps: ['/src/App.vue'],
        //     fn: ([mod])=> cli注入render函数(mod)
        // }]   
        for (const { deps, fn } of qualifiedCallbacks) {
             // fn(deps.map((dep) => moduleMap.get(dep)));
            let depsPararm= deps.map((dep) => {
                return  moduleMap.get(dep)
            })
            console.log('1111111', depsPararm);
            //depsPararm [newMod]
            fn(depsPararm);
        }
        // const loggedPath = isSelfUpdate ? path : `${acceptedPath} via ${path}`;
        console.log(`[vite] hot updated: ${path}`);
    };
}

async function queueUpdate(p) {
    queued.push(p);
    if (!pending) {
        pending = true;
        await Promise.resolve();
        pending = false;
        const loading = [...queued];
        queued = [];
        console.log('queueUpdate called');
        (await Promise.all(loading)).forEach((fn) => fn && fn());
    }
}

//创建热更新的上下文环境
const createHotContext = (ownerPath) => {
    const mod = hotModulesMap.get(ownerPath);
    //当已经存在render回调时，证明之前已经加载过一次这个模块,设置回调为空
    if (mod) {
        mod.callbacks = [];
    }
    function acceptDeps(deps, callback = () => { }) {
        const mod = hotModulesMap.get(ownerPath) || {
            id: ownerPath,
            callbacks: []
        };
        mod.callbacks.push({
            deps,
            fn: callback
        });
        hotModulesMap.set(ownerPath, mod);
    }
    const hot = {
        //创建了热更新上下文环境之后，在hotModulesMap中存储
        // {
        //     key: '/src/App.vue',
        //     value: {
        //         id: '/src/App.vue',
        //         callbacks: [{
        //              deps: ['/src/App.vue'],
        //              fn: ([mod])=> cli注入render函数(mod)
        //          }]
        //     }
        // }
        accept(deps, callback) {
            console.log('accept ennter deps', deps, ownerPath);
            if (typeof deps === 'function' || !deps) {
                acceptDeps([ownerPath], ([mod]) => deps && deps(mod));
            }
        }
    };
    return hot;
};
export { createHotContext };