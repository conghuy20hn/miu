<?php
/**
 *
 * full preset returns the full toolbar configuration set for CKEditor.
 *
 * @author Antonio Ramirez <amigo.cobos@gmail.com>
 * @link http://www.ramirezcobos.com/
 * @link http://www.2amigos.us/
 */
return [
    'height' => "100%",
    'toolbarGroups' => [
        ['name' => 'document', 'groups' => ['mode', 'document', 'doctools']],
        ['name' => 'clipboard', 'groups' => ['clipboard', 'undo']],
        ['name' => 'editing', 'groups' => [ 'find', 'selection', 'spellchecker']],
        ['name' => 'forms'],
        '/',
        ['name' => 'basicstyles', 'groups' => ['basicstyles', 'colors','cleanup']],
        ['name' => 'paragraph', 'groups' => [ 'list', 'indent', 'blocks', 'align', 'bidi' ]],
        ['name' => 'links'],
        ['name' => 'insert'],
        '/',
        ['name' => 'styles'],
        ['name' => 'blocks'],
        ['name' => 'colors'],
        ['name' => 'tools'],
        ['name' => 'others'],

        'filebrowserBrowseUrl' => "/js/ckfinder/ckfinder.html",
        'filebrowserImageBrowseUrl' => "/js/ckfinder/ckfinder.html?type=Images",
        'filebrowserFlashBrowseUrl' => "/ckfinder/ckfinder.html?type=Flash",
        'filebrowserUploadUrl' => "/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files",
        'filebrowserImageUploadUrl' => "/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images",
        'filebrowserFlashUploadUrl' => "/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash",
    ],
    'removeButtons' => 'Smiley,Iframe,Source',
];
