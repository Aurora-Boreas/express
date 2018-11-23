const jwa = require('jwa');
const hmac = jwa('HS256');
const es = require('elasticsearch')
const _ = require("lodash")
import builder from 'bodybuilder'
import { sgnSrc } from '../lib/util'

class ProductProcessor {
  constructor (config, entityType, indexName) {
    this._config = config
    this._entityType = entityType
    this._indexName = indexName
    this.esClient = new es.Client({
      host: config.esHost,
      requestTimeout: 5000
    })
  }

  prepareProductsData (items) {
    return _.each(items, (item) => {
      let itemSource = item._source ? item._source : item
      let product_id = typeof itemSource.values['product_id']!== 'undefined' ? itemSource.values['product_id'] : null
      let value = itemSource.values['value'] && parseFloat(itemSource.values['value']) ? parseFloat(itemSource.values['value']) : 0

      itemSource.product_id = product_id
      itemSource.value = value
    })
  }

  process (items) {

    let ItemsPromise

    items = this.prepareProductsData(items)

    return new Promise((resolve, reject) => {

      let product_id = items.filter(i => i._source.product_id !== null).map(item => item._source.product_id)
      if (product_id.length === 0) {
        resolve(items)
      }

      let query = builder().query('bool')
      query = query.filter('terms', 'product_id.keyword', product_id).build()

      const esQuery = {
        index: this._indexName,
        type: this._entityType,
        body: query,
        size: 9999,
        from: 0,
        sort: ''
      }

      this.esClient.search(esQuery).then(function (resp) {
        // handle result
        if (resp === null) {
          throw new Error('Invalid ES result - null not excepted')
        }
      }).catch(function (err) {
        reject(err)
        console.error(err)
      })

    } else {
      ItemsPromise = new Promise ((resolve, reject) => {
        resolve(items)
      })
    }

  }
}

module.exports = ProductProcessor