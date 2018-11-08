import request from 'request';
import ProcessorFactory from '../processor/factory';

export default ({config, db}) => function (req, res, body) {
	let groupId = null

	// Request method handling: exit if not GET or POST
	// Other metods - like PUT, DELETE etc. should be available only for authorized users or not available at all)
	if (!(req.method == 'GET' || req.method == 'POST' || req.method == 'OPTIONS')) {
		throw new Error('ERROR: ' + req.method + ' request method is not supported.')
	}

	const urlSegments = req.url.split('/');

	let indexName = ''
	let entityType = ''
	if (urlSegments.length < 2)
		throw new Error('No index name given in the URL. Please do use following URL format: /api/catalog/<index_name>/<entity_type>_search')
	}

	// pass the request to elasticsearch
	let url = 'http://' + config.elasticsearch.host + ':' + config.elasticsearch.port + req.url;

	request({ // do the elasticsearch request
		uri: url,
		method: req.method,
		body: req.body,
		json: true
	}, function (_err, _res, _resBody) { // TODO: add caching layer to speed up SSR? How to invalidate products (checksum on the response BEFORE processing it)
		if (_resBody && _resBody.hits && _resBody.hits.hits) { // we're signing up all objects returned to the client to be able to validate them when (for example order)

			const factory = new ProcessorFactory(config)
			let resultProcessor = factory.getAdapter(entityType, indexName)

			if (!resultProcessor)
				resultProcessor = factory.getAdapter('default', indexName) // get the default processor

      if (entityType === 'product') {
        resultProcessor.process(_resBody.hits.hits, groupId).then((result) => {
          _resBody.hits.hits = result
          res.json(_resBody);
        }).catch((err) => {
          console.error(err)
        })
      } else {
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
