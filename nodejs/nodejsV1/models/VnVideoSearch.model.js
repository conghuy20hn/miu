
const VnVideoBase = require('../models/VnVideo.model');
const vnVideoEnum = require('../services/lib/vnVideoEnum');
const config = require('../config/params');
exports.search = function (query, loadOffset, loadLimit) {
    let filters = {
        must: [
            {
                term: {
                    item_type: vnVideoEnum.TYPE_VOD
                }
            },

            {
                term: {
                    is_active: true
                }
            },
            {
                term: { status: vnVideoEnum.STATUS_APPROVE }
            },
            {
                range: {
                    published_time: {
                        "lte": new Date()
                    }
                }
            }
        ]
    };
    let params = {
        from: loadOffset,
        size: loadLimit,
        query: {
            bool: {
                must: {
                    multi_match: {
                        query: query,
                        type: "phrase_prefix",
                        fields: ["name^4", "test_search^2"],
                        prefix_length: 2,
                        slop: 10,
                        max_expansions: 10000

                    }
                },
                filter: {
                    bool: filters
                }
            }
        }

    };
    let searchResults = [];

    
    const options = {
        method: 'POST',
        url: config.configStr.urlElasticSearch,
        json: params,
    }
    var request = require('request');

    request(options, function (error, response, body) {
        console.log(options);
        console.log(error);
        if (!error && response.statusCode == 200) {
            if (Utils.isset(response['hits']['hits'])) {
                searchResults = response['hits']['hits'];
            }
        }
    });

    return searchResults;

}