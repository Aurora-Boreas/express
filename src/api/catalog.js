import request from 'request';
import ProcessorFactory from '../processor/factory';

function (req, res, body) {

  const urlSegments = req.url.split('/');

  let indexName = ''
	let entityType = ''

  if (urlSegments.length = 2)
    indexName = urlSegments[1];

	if (urlSegments.length > 2)
		entityType = urlSegments[2]

	if (config.elasticsearch.indices.indexOf(indexName) < 0) {
		throw new Error('Invalid / inaccessible index name given in the URL. Please do use following URL format: /api/catalog/<index_name>/_search')
	}

	if (urlSegments[urlSegments.length - 1].indexOf('_search') !== 0) {
		throw new Error('Please do use following URL format: /api/catalog/<index_name>/_search')
	}

  // pass the request to elasticsearch
  //Elasticsearch's _search API expects only GET or POST
	let url = 'http://' + config.elasticsearch.host + ':' + config.elasticsearch.port + req.url;

  request({ // do the elasticsearch request
  uri: url,
  method: req.method,
  body: req.body,
  json: true},
   function (_err, _res, _resBody) { // TODO: add caching layer to speed up SSR? How to invalidate products (checksum on the response BEFORE processing it)
  if (_resBody && _resBody.hits && _resBody.hits.hits) { // we're signing up all objects returned to the client to be able to validate them when (for example order)

    const factory = new ProcessorFactory(config)
    let resultProcessor = factory.getAdapter(entityType, indexName)

    if (!resultProcessor)
      resultProcessor = factory.getAdapter('default', indexName) // get the default processor

      resultProcessor.process(_resBody.hits.hits).then((result) => {
        _resBody.hits.hits = result
        res.json(_resBody);
      }).catch((err) => {
        console.error(err)
      })
    }

  } else {
    res.json(_resBody);
  }
});
}





var elasticsearch = require('elasticsearch'),
    client = new elasticsearch.Client({
        host: '127.0.0.1:9200',
        log: 'trace'
    });
    client.search({
        index: '[your index]',
        q: 'simple query',
        fields: ['field']
    }, function (err, results) {
        if (err) next(err);
        var ids = []
        if (results && results.hits && results.hits.hits) {
            ids = results.hits.hits.map(function (h) {
                return h._id;
            })
        }
        searchHandler(ids, next)
    })
