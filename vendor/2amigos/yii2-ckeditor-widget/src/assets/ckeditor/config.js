
CKEDITOR.editorConfig = function( config )
{
    // Define changes to default configuration here. For example:
    config.language = 'en';

    // config.uiColor = '#AADC6E';

    config.toolbar_Full = [
        ['-','Save','NewPage','Preview','-','Templates'],
        //['Source','-','Save','NewPage','Preview','-','Templates'],
        ['Cut','Copy','Paste','PasteText','PasteFromWord','-','Print', 'SpellChecker', 'Scayt'],
        ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
        '/',
        ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
        ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote','CreateDiv'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
        ['BidiLtr', 'BidiRtl' ],
        ['Link','Unlink','Anchor'],
        ['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe'],
        '/',
        ['Styles','Format','Font','FontSize'],
        ['TextColor','BGColor'],
        ['Maximize', 'ShowBlocks','-','About']
    ];

    config.entities = false;
    //config.entities_latin = false;


    config.filebrowserBrowseUrl = '/fckeditor/ckfinder/ckfinder.html';

    config.filebrowserImageBrowseUrl = '/fckeditor/ckfinder/ckfinder.html?type=Images';

    config.filebrowserFlashBrowseUrl = '/fckeditor/ckfinder/ckfinder.html?type=Flash';

    config.filebrowserUploadUrl = '/fckeditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files';

    config.filebrowserImageUploadUrl = '/fckeditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images';

    config.filebrowserFlashUploadUrl = '/fckeditor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash';

};  