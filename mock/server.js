// server.js
const jsonServer = require('json-server')
const db = require('./db')
const port = 3010;

let routes = {};

for(let i in db){
    if(i.indexOf('_') != -1){
        let key = '/mock/'+i.split('_').join('/')+'?*';
        routes[key] = '/'+i;
    }
}

const server = jsonServer.create()
const router = jsonServer.router(db)
const middlewares = jsonServer.defaults()
const rewriter = jsonServer.rewriter(routes)

server.use(middlewares)
// 将 POST 请求转为 GET
server.use((request, res, next) => {
    request.method = 'GET';
    next();
})

server.use(rewriter) // 注意：rewriter 的设置一定要在 router 设置之前
server.use(router)

server.listen(port, () => {
    console.log('open mock server at localhost:' + port)
})