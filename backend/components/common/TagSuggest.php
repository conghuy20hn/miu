<?php

namespace backend\components\common;

use common\libs\Search;
use sjaakp\taggable\TagSuggestAction;
use yii\helpers\Json;

class TagSuggest extends TagSuggestAction {

    /**
     * @var string
     * The (full) class name of the Tag class.
     */
    public $preKey;

    /**
     * @var string
     * The (full) class name of the Tag class.
     */
    public $tagClass;

    /**
     * @var string
     * The name attribute of the Tag class.
     */
    public $nameAttribute = 'name';

    /**
     * @var string
     * The pattern used for searching suggestions.
     * Default searches for Tag names beginning with the search term.
     * Change this to '%{term}%' to search Tag names with the search term in any position.
     */
    public $like = '{term}%';

    public function run($term = '') {
        $data = Search::searchObject($this->preKey . ':' . $term);
        $dataItems = $data['full_items'];
        $r = [];
        $itemName = $this->nameAttribute;
        foreach ($dataItems as $item) {
            $r[] = $item->$itemName;
        }
        return Json::encode($r);
    }

}
