//мусор, можно не смотреть)

// const express = require('express'),
//       app = express(),
//       port = process.env.PORT || 8079;
//
// const elasticsearch = require('elasticsearch');
// const client = new elasticsearch.client({
//   host: 'elasticsearch:9200',
//   log: 'trace'
// });
//
// app.listen(port);
// console.log('API app server started on:' + port);
//
// app.get('/catalog', function (req, res) {
//   res.send('Hello world');
// })
// const elasticsearch = require('elasticsearch')
// const es_client = elasticsearch.Client({
//   host: process.env.ELASTICSEARCH_HOST + ':9200'
// })
// const es_index = 'ecs_index'
// const es_type = 'ecs_type'
//
// const urlSegments = req.url.split('/');
//
//
// let indexName = ''
// let entityType = ''
// app.get('/api/catalog', function (req, res) {
//   es_client.search({
//     index: es_index,
//     type: es_type,
//     body: {
//       query: {
//         "query_string": {
//           "fields": ["size", "from", "sort"],
//         }
//       }
//     }
//   }).then(function(response){
//     res.send(response.hits.hits)
//   }, function(error) {
//     res.status(error.statusCode).send(error.message)
//   })
// })
//
//
//
// // app.get('/api/catalog', function (req, res) {
// // let.size_item = req.param('size')
// // let.from_item = req.param('from')
// // let.sort_item = req.param('sort')
// // }
// // res.send(size_item+''+from_item+''+sort_item)});
// // app.param(['size','from','sort'], function(req, res, next, sorting))
//
// app.use('/api/catalog', function (req, res, next) {
//   if (req.method !== 'GET' || req.method !== 'POST')
//   res.status(404).send({ 'Method is not supported.' });
//   next(err);
// })
//
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', { error: err });
// })
