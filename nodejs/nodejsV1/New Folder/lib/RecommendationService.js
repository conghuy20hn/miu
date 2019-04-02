module.exports = {
BOX_RELATED:'1',
BOX_RECOMMEND: '2',
getVideoIds(boxId, deviceId, videoId = null, metaData = [], page = 1, limit = 10)
    {
        let results = [];
        let beginTime = Math.round((Date.now() % 1000) / 1000);

        let orgData = {
            box_id: boxId,
            device_id: deviceId,
            video_id: videoId,
            page: page,
            limit: limit
        };

        let data = orgData.concat(metaData);

        // try {
        //     $client = new Client();
        //     $response = $client->createRequest()
        //         ->setMethod('GET')
        //         ->setUrl(Yii::$app->params['recommendation']['url'])
        //         ->setData($data)
        //         ->setOptions([
        //             'timeout' => Yii::$app->params['recommendation']['timeout'],
        //         ])
        //         ->send();
        //     if ($response->isOk && isset($response->data['video_infors'])) {
        //         $results = $response->data['video_infors'];
        //     }

        //     \Yii::info('{RECOMMEND} BoxID: ' . $boxId . '|DeviceId: ' . $deviceId . '|VideoId: ' . $videoId . '|Data: ' . json_encode($data) . '|Page: ' . $page . '|Limit: ' . $limit . ' => results: ' . json_encode($results) . ' (' . (round(microtime(true) * 1000) - $beginTime) . ' ms)', 'recommend');

        // }catch(\Exception $e){
        //     \Yii::error('{RECOMMEND} BoxID: ' . $boxId . '|DeviceId: ' . $deviceId . '|VideoId: ' . $videoId  . '|Data: ' . json_encode($data) . '|Page: ' . $page . '|Limit: ' . $limit . ' => results: ' . $e->getMessage() . ' (' . (round(microtime(true) * 1000) - $beginTime) . ' ms)', 'recommend');
        // }
        // return $results;
        return true;
    }
}