function shallowReactive(param) {
    return new Proxy(param, {
        get(obj, key) {
            return obj[key]
        },
        set(obj, key, value) {
            obj[key] = value;
            console.log('update UI');
            return true
        }
    })
}

let state = shallowReactive({ gf: { f: { s: { d: 4 }, c: 3 }, b: 2 }, a: 1 })
console.log('state.gf', state.gf);
console.log('state.gf.f', state.gf.f);
console.log('state.gf.f.s', state.gf.f.s);
state.a = 666;
state.gf.b = 666;
state.gf.f.c = 666;
state.gf.f.s.d = 666;
console.log('state', state);