<?php

namespace backend\components\common;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class UploadType {

    static $type = '';

    public function __construct($type) {
        self::$type = $type;
    }

    public static function getType() {
        return self::$type;
    }

}
