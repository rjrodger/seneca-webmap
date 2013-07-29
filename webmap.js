/* Copyright (c) 2013 Richard Rodger, MIT License */
"use strict";


var url    = require('url')
var buffer = require('buffer')

var _ = require('underscore')


module.exports = function( options ) {
  var seneca = this
  var name   = 'webmap'




  options = seneca.util.deepextend({
    fixed:{},
    wrap: function( gen, req, requrl ) { return gen( req, requrl ) }
  },options)
  


  var router = seneca.util.router()



  seneca.add({role:name,cmd:'define'},define_map)



  function define_map( args, done ) {
    var map = args.map

    _.each( map, function( patterns, method ){
      _.each( patterns, function( generator, pathname ){

        var pat = {pathname:pathname}
        var gen = function( req, requrl ) { return requrl.query }
        router.add(pat,gen)
      })
    })
  }





  seneca.act('role:web',{use:function(req,res,next){
    var requrl = url.parse(req.url,true)

    var pat = {pathname:requrl.pathname}
    console.dir(pat)
    console.log(''+router)

    var gen = router.find( pat )
    if(!gen) return next();

    var args = options.wrap( gen, req, requrl )
    
    args = _.extend(args,options.fixed,{role:'echo'})
    console.dir(args)

    this.act( args, function( err, out ){
      console.dir(err)
      console.dir(out)

      if( err ) return next(err);
      
      var outjson = JSON.stringify(out)

      res.writeHead(200,{
        'Content-Type':   'application/json',
        'Cache-Control':  'private, max-age=0, no-cache, no-store',
        'Content-Length': buffer.Buffer.byteLength(outjson) 
      })
      res.end( outjson )
    })
  }})


  

  return {
    name: name
  }
}
