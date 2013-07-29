var http   = require('http')

var seneca = require('seneca')()

seneca.use('..',{fixed:{bar:1}})


seneca.act({role:'webmap',cmd:'define',map:{
  GET: {
    '/echo':'gen'
  }
}})


seneca.use('echo')


var web = seneca.export('web')

http.createServer(function (req, res) {
  web(req,res,function(err){
    console.log(err)
    res.writeHead(err?500:404)
    res.end(err?''+err:'')
  })
}).listen(8090)


console.log('listen 8090')

