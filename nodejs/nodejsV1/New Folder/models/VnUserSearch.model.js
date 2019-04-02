
const VnVideoBase = require('../models/VnVideo.model');
const vnVideoEnum = require('../services/lib/vnVideoEnum');
const config = require('../config/params');
const http = require('http');
exports.search = function (query, loadOffset, loadLimit) {
    let filters = {
        must: [
            {
                term: { user_status: true },
            },
            {
                range: {
                    video_count: {
                        gt: 0
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
                must: [
                    {
                        multi_match: {
                            query: query,
                            type: "phrase",
                            fields: ["name^4", "test_search^2"],
                            slop: 30
                        }
                    },
                    /*[
                        "multi_match" => [
                            "query" => $textQuery,
                            "type" => "best_fields",
                            "fields" => ["name^4", "test_search^2"],
                            "minimum_should_match" => "95%",
                            "fuzziness" => 2
     
                        ]
                    ]*/
                ],

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