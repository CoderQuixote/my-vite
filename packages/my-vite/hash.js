/*
 * @Descripttion: websocket client用于本地node服务和网页进行通讯
 * @version 1.0.0
 * @Author: cfwang 
 * @Date: 2021-04-05 20:20:25 
 */
function pad(hash2, len) {
    while (hash2.length < len) {
        hash2 = "0" + hash2;
    }
    return hash2;
}

function fold(hash2, text) {
    var i;
    var chr;
    var len;
    if (text.length === 0) {
        return hash2;
    }
    for (i = 0, len = text.length; i < len; i++) {
        chr = text.charCodeAt(i);
        hash2 = (hash2 << 5) - hash2 + chr;
        hash2 |= 0;
    }
    return hash2 < 0 ? hash2 * -2 : hash2;
}

function foldObject(hash2, o, seen) {
    return Object.keys(o).sort().reduce(foldKey, hash2);

    function foldKey(hash3, key) {
        return foldValue(hash3, o[key], key, seen);
    }
}

function foldValue(input, value, key, seen) {
    var hash2 = fold(fold(fold(input, key), toString(value)), typeof value);
    if (value === null) {
        return fold(hash2, "null");
    }
    if (value === void 0) {
        return fold(hash2, "undefined");
    }
    if (typeof value === "object" || typeof value === "function") {
        if (seen.indexOf(value) !== -1) {
            return fold(hash2, "[Circular]" + key);
        }
        seen.push(value);
        var objHash = foldObject(hash2, value, seen);
        if (!("valueOf" in value) || typeof value.valueOf !== "function") {
            return objHash;
        }
        try {
            return fold(objHash, String(value.valueOf()));
        } catch (err) {
            return fold(objHash, "[valueOf exception]" + (err.stack || err.message));
        }
    }
    return fold(hash2, value.toString());
}

function toString(o) {
    return Object.prototype.toString.call(o);
}

function sum(o) {
    return pad(foldValue(0, o, "", []).toString(16), 8);
}
module.exports = sum;