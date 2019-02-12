<?php

/**
 *
 * basic preset returns the basic toolbar configuration set for CKEditor.
 *
 * @author Antonio Ramirez <amigo.cobos@gmail.com>
 * @link http://www.ramirezcobos.com/
 * @link http://www.2amigos.us/
 */
return [
    'height' => "100%",
    'toolbarGroups' => [
        ['name' => 'undo'],
        ['name' => 'basicstyles', 'groups' => ['basicstyles', 'cleanup']],
        ['name' => 'colors'],
        ['name' => 'links', 'groups' => ['links', 'insert']],
        ['name' => 'others', 'groups' => ['others', 'about']],
    ],
    'removeButtons' => 'Subscript,Superscript,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Source',
    'removePlugins' => 'elementspath',
    'resize_enabled' => false,

    'filebrowserBrowseUrl' => "/js/ckfinder/ckfinder.html",
    'filebrowserImageBrowseUrl' => "/js/ckfinder/ckfinder.html?type=Images",
    'filebrowserFlashBrowseUrl' => "/ckfinder/ckfinder.html?type=Flash",
    'filebrowserUploadUrl' => "/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files",
    'filebrowserImageUploadUrl' => "/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images",
    'filebrowserFlashUploadUrl' => "/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash",
];
