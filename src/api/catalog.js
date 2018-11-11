import resource from 'resource-router-middleware';
import catalog from '../models/catalog';
import request from 'request';
import config from '../config'

// export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
// 	id : 'facet',
//
// 	/** For requests with an `id`, you can auto-load the entity.
// 	 *  Errors terminate the request, success sets `req[id] = data`.
// 	 */
// 	load(req, id, callback) {
// 		let facet = facets.find( facet => facet.id===id ),
// 			err = facet ? null : 'Not found';
// 		callback(err, facet);
// 	},
//
// 	/** GET / - List all entities */
// 	index({ params }, res) {
// 		res.json(facets);
// 	},
//
// 	/** POST / - Create a new entity */
// 	create({ body }, res) {
// 		body.id = facets.length.toString(36);
// 		facets.push(body);
// 		res.json(body);
// 	},
//
// 	/** GET /:id - Return a given entity */
// 	read({ facet }, res) {
// 		res.json(facet);
// 	},
//
// 	/** PUT /:id - Update a given entity */
// 	update({ facet, body }, res) {
// 		for (let key in body) {
// 			if (key!=='id') {
// 				facet[key] = body[key];
// 			}
// 		}
// 		res.sendStatus(204);
// 	},
//
// 	/** DELETE /:id - Delete a given entity */
// 	delete({ facet }, res) {
// 		facets.splice(facets.indexOf(facet), 1);
// 		res.sendStatus(204);
// 	}
// });
// import resource from 'resource-router-middleware';
// import catalog from '../models/catalog';
//
// import request from 'request';
import ProcessorFactory from '../processor/factory';

export default ({config, db}) => function (req, res, body) {
	let groupId = null
//
// 	// Request method handling: exit if not GET or POST
// 	// Other metods - like PUT, DELETE etc. should be available only for authorized users or not available at all)
	if (!(req.method == 'GET' || req.method == 'POST' || req.method == 'OPTIONS')) {
		throw new Error('ERROR: ' + req.method + ' request method is not supported.')
	}
//
	const urlSegments = req.url.split('/');
//
	let indexName = ''
	let entityType = ''
	if (urlSegments.length < 2) {
		throw new Error('No index name given in the URL. Please do use following URL format: /api/catalog/<index_name>/<entity_type>_search')
	};

// 	// pass the request to elasticsearch
	let url = 'http://' + config.elasticsearch.host + ':' + config.elasticsearch.port + req.url;
//
	request({ // do the elasticsearch request
		uri: url,
		method: req.method,
		body: req.body,
		json: true
	}, function (_err, _res, _resBody) {
		if (_resBody && _resBody.hits && _resBody.hits.hits) { // we're signing up all objects returned to the client to be able to validate them when (for example order)
		//
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

		} else {
			res.json(_resBody);
		}
	}
	)
};
