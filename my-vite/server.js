/*
 * @Descripttion: 创建服务，监听本地文件变化，本地node服务和客户端进行通讯
 * @version 1.0.0
 * @Author: cfwang 
 * @Date: 2021-04-06 21:45:25 
 */
//watch files change module
const chokidar = require('chokidar');
const http2 = require('http2');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const fileDir = process.cwd();

module.exports = function createServer(app) {
    //读取https本地私钥和证书
    const cert = fs.readFileSync(path.join(__dirname, './cert.pem'));
    //创建http2请求
    const webServer = http2.createSecureServer({ cert, key: cert, allowHTTP1: true }, app.callback());
    //创建websocket服务用于nodejs进程和浏览器通讯，用于热更新
    const wss = new WebSocket.Server({ noServer: true });
    webServer.on('upgrade', (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req)
        })
    })
    wss.on('connection', (socket) => {
        //发送链接请求
        socket.send(JSON.stringify({ type: 'connected' }))
    })
    wss.on('error', (e) => {
            console.log('wss error', e);
        })
        //监听文件状态
    const watcher = chokidar.watch(fileDir, {
            ignored: ['**/node_modules/**', '**/.git/**'],
            ignoreInitial: true,
            ignorePermissionErrors: true,
            disableGlobbing: true
        })
        //文件change事件
    watcher.on('change', async(file) => {

        const faPath = file.replace(`${process.cwd()}`, '').replace(/\\/g, '/');
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'update',
                    updates: [{
                        type: 'js-update',
                        timestamp: Date.now(),
                        path: faPath,
                        acceptedPath: faPath
                    }]
                }))
            }
        })
    })
    return webServer;
}