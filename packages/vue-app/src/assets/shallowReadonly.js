function shallowReadonly(param) {
    return new Proxy(param, {
        get(obj, key) {
            return obj[key]
        },
        set(obj, key, newValue) {
            console.warn(`Set operation on key "${key}" failed: target is readonly.`, obj)
        }
    })
}

let state = shallowReadonly({ gf: { b: 2 }, a: 1 });

state.a = 666;
state.gf.b = 666;
console.log('state.a', state.a);
console.log('state.gf.b', state.gf.b);