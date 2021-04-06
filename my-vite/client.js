/*
 * @Descripttion: websocket client用于本地node服务和网页进行通讯
 * @version 1.0.0
 * @Author: cfwang 
 * @Date: 2021-04-05 22:15:25 
 */
const isFirstUpdate = true;
const base = "/" || '/';
const hotModulesMap = new Map();
const disposeMap = new Map();
const pruneMap = new Map();
const dataMap = new Map();
const ctxToListenersMap = new Map();
const customListenersMap = new Map();
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
            setInterval(() => socket.send('ping'), 30000);
            break;
        case 'update':
            // if (isFirstUpdate) {
            //     window.location.reload();
            //     return;
            // }else {
            //     isFirstUpdate = false;
            // }
            console.log('handleMessage update enter', payload.updates);
            payload.updates.forEach((update) => {
                if (update.type === 'js-update') {
                    queueUpdate(fetchUpdate(update));
                }
            });
            break;
    }
}


async function fetchUpdate({ path, acceptedPath, timestamp }) {
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
    const qualifiedCallbacks = mod.callbacks.filter(({ deps }) => {
        return deps.some((dep) => modulesToUpdate.has(dep));
    });
    await Promise.all(Array.from(modulesToUpdate).map(async(dep) => {
                    const disposer = disposeMap.get(dep);
                    if (disposer)
                        await disposer(dataMap.get(dep));
                    const [path, query] = dep.split(`?`);
                    try {
                        const newMod = await
                        import （
                            base +
                            path.slice(1) +
                            `?import&t=${timestamp}${query ? `&${query}` : ''}`);
            moduleMap.set(dep, newMod);
        }
        catch (e) {
            warnFailedFetch(e, dep);
        }
    }));
    return () => {
        for (const { deps, fn } of qualifiedCallbacks) {
            fn(deps.map((dep) => moduleMap.get(dep)));
        }
        const loggedPath = isSelfUpdate ? path : `${acceptedPath} via ${path}`;
        console.log(`hot updated: ${loggedPath}`);
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
        (await Promise.all(loading)).forEach((fn) => fn && fn());
    }
}

const createHotContext = (ownerPath) => {
    if (!dataMap.has(ownerPath)) {
        dataMap.set(ownerPath, {});
    ｝
    const mod = hotModulesMap.get(ownerPath);
    if (mod) {
        mod.callbacks = [];
    }
    
    const staleListeners = ctxToListenersMap.get(ownerPath);
    if (staleListeners) {
        for (const [event, staleFns] of staleListeners) {
            const listeners = customListenersMap.get(event);
            if (listeners) {
                customListenersMap.set(event, listeners.filter((l) => !staleFns.includes(l)));
            }
        }
    }
    const newListeners = new Map();
    ctxToListenersMap.set(ownerPath, newListeners);
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
        get data() {
            return dataMap.get(ownerPath);
        },
        accept(deps, callback) {
            if (typeof deps === 'function' || !deps) {
               
                acceptDeps([ownerPath], ([mod]) => deps && deps(mod));
            }
            else if (typeof deps === 'string') {
                
                acceptDeps([deps], ([mod]) => callback && callback(mod));
            }
            else if (Array.isArray(deps)) {
                acceptDeps(deps, callback);
            }
            else {
                throw new Error(`invalid hot.accept() usage.`);
            }
        },
        acceptDeps() {
            throw new Error(`hot.acceptDeps() is deprecated. ` +
                `Use hot.accept() with the same signature instead.`);
        },
        dispose(cb) {
            disposeMap.set(ownerPath, cb);
        },
        prune(cb) {
            pruneMap.set(ownerPath, cb);
        },
        // TODO
        decline() { },
        invalidate() {
            location.reload();
        },
        on(event, cb) {
            const addToMap = (map) => {
                const existing = map.get(event) || [];
                existing.push(cb);
                map.set(event, existing);
            };
            addToMap(customListenersMap);
            addToMap(newListeners);
        }
    };
    return hot;
};
export { createHotContext };
