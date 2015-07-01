#!/usr/bin/env node

/*
 * @version 0.3, 3 June 2014
 */

var ElasticClient = require('elasticsearchclient'),
   firebase      = require('firebase'),
   conf          = require('./config'),
 fbutil          = require('./js/lib/fbutil'),
   PathMonitor   = require('./js/lib/PathMonitor'),
   SearchQueue   = require('./js/lib/SearchQueue'); 
// connect to ElasticSearch
var esc = new ElasticClient({
   host: 'localhost',
   port: '9200',
//   pathPrefix: 'optional pathPrefix',
   secure: false,
   //Optional basic HTTP Auth
   auth: conf.ES_USER? {
      username: conf.ES_USER,
      password: conf.ES_PASS
   } : null
});
console.log('Connected to ElasticSearch host %s:%s'.yellow, conf.ES_HOST, conf.ES_PORT);
console.log(conf.FB_REQ, conf.FB_RES);
fbutil.auth(conf.FB_URL, conf.FB_TOKEN).done(function() {
   PathMonitor.process(esc, conf.FB_URL, conf.paths, conf.FB_PATH);
   SearchQueue.init(esc, conf.FB_URL, conf.FB_REQ, conf.FB_RES, conf.CLEANUP_INTERVAL);
});
