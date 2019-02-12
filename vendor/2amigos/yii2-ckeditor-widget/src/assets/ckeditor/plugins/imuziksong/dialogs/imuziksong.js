/**
 * Created by JetBrains PhpStorm.
 * User: tuanbm
 * Date: 5/18/12
 * Time: 8:56 AM
 * To change this template use File | Settings | File Templates.
 */

function searchsong(editorName){
    //alert("Searching");
    var param = $('#'+editorName+'_search').val();
    if(param==""){
        alert("Nhập nội dung cần tìm kiếm");
        return;
    }
    var link = "/backend.php/ajax/searchSong/keyword/"+param;
//    var link = "/backend.php/ajax/searchSong/keyword/jd";
    $.ajax({
        type: "GET",
        url: link,
        cache: false,
        success: function(data) {
//            var outTable = "<table><tr><td>id </td><td>name </td><td></td></tr>" +
//                "<tr><td>565 </td><td>Tinh la gi    </td><td><a href='link'>Chọn </a> </td></tr>"
//                "</table>"
            processedData =  CreateTableForCkEditor(data,editorName);
//            alert(processedData);
            $('#'+editorName+'_showresult').html(processedData);
        },
        error: function(request, status, err) {
            alert(err);
        }
    });
}


function CreateTableForCkEditor(objArray, editorName) {
    // set optional theme parameter
    var theme = ""
    var enableHeader = true;

    // If the returned data is an object do nothing, else try to parse
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var str = '<table class="' + theme + '" style="border:1 px solid silver;padding: 5px;">';


    // table head
    if (enableHeader) {
        str += '<thead><tr>';
        str += '<th scope="col" >Chon</th>';
        for (var index in array[0]) {
            str += '<th scope="col" >' + index + '</th>';
        }
        str += '</tr></thead>';
    }

    // table body
    str += '<tbody>';
    for (var i = 0; i < array.length; i++) {
        str += (i % 2 == 0) ? '<tr class="alt">' : '<tr>';
        var key = array[i]["id"];
        str += '<td style="padding: 5px;"><a href="javascript:addSongCode(\''+key+'\',\''+editorName+'\');" style="cursor: pointer;text-decoration: green;">Chọn </a></td>';
        for (var index in array[i]) {
            var content =  array[i][index];
            str += '<td style="padding: 5px;" title="'+content+'">' +  content.substr(0,30) + '</td>';
        }
        str += '</tr>';
    }
    str += '</tbody>'
    str += '</table>';
    return str;
}


//function for adding time to the source
function addSongCode(code,editorName){
    var e = CKEDITOR.instances[editorName];
    //get the value of 'format' field in the 'info' tab of the dialog box
//    var t = dialog.getValueOf('info', 'format');
//    if(t.length == 0){
//        alert('Please select date format.')
//        return false;
//    }
//    $('#testname').val("def");
//    var t2 = dialog.getValueOf('info', 'testname');

    e.insertHtml("[IMUZIKSONG]"+code+"[/IMUZIKSONG]");

//    return false;
};
CKEDITOR.dialog.add("imuziksong",function(e){

    var date=new Date();
    var months = new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');

    var h=date.getHours();
    var nh=h;
    var m=date.getMinutes();
    var s=date.getSeconds();
    var a;
    if(h>12){a="PM"; nh=h-12;}
    if(h<=12){a="AM"; nh=h;}

    //Create different time formats
    var t1 = months[parseInt(date.getMonth())]+' '+date.getDate()+" @ " + nh +  ":" + m + " " + a;
    var t2 = date.getFullYear()+'-'+parseInt(date.getMonth()+1) +'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    var t3 = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();

    return {
        title:'Embed Imuzik',
        resizable : CKEDITOR.DIALOG_RESIZE_BOTH,
        minWidth:380,
        minHeight:380,
        onShow:function(){
        },
        onLoad:function(){
            dialog = this;
            this.setupContent();
        },
        onOk:function(){
        },
        contents:[
            {  id:"tabSongEditor",
                name:'tabSongEditor',
                label:'Bài hát',
                elements:[
                    {
                        type:'html',
                        html:'<span style="">Bài hát cần tìm:<br/> <input type="text" id="'+e.name+'_search" name="'+e.name+'_search" style="border:1px solid;" /> </span>'
                            +'<br/> '+''
                            +'<br/><span><input type="button" name="search" value="Search" onclick="searchsong(\''+e.name+'\');" style="border:1px solid;" />'
                            +'<br/><div id="'+e.name+'_showresult"></div>'
                            + '</span>'
                    }
                ]
            },
            {
                id:"tabVideoEditor",
                name:'tabVideoEditor',
                label:'Video',
                elements:[
                    {
                        type:'html',
                        html:'<span style="">Bài hát cần tìm:<br/> <input type="text" id="'+e.name+'_search" name="'+e.name+'_search" style="border:1px solid;" /> </span>'
                            +'<br/> '+''
                            +'<br/><span><input type="button" name="search" value="Search" onclick="searchvideo(\''+e.name+'\');" style="border:1px solid;" />'
                            +'<br/><div id="'+e.name+'_showresult"></div>'
                            + '</span>'
                    }
                ]
            }
            ,
            {
                id:"tabSurveyEditor",
                name:'tabSurveyEditor',
                label:'Survey',
                elements:[
                    {
                        type:'html',
                        html:'<span style="">Loại khảo sát cần tìm:<br/> <input type="text" id="'+e.name+'_search" name="'+e.name+'_search" style="border:1px solid;" /> </span>'
                            +'<br/> '+''
                            +'<br/><span><input type="button" name="search" value="Search" onclick="searchsurvey(\''+e.name+'\');" style="border:1px solid;" />'
                            +'<br/><div id="'+e.name+'_showresult"></div>'
                            + '</span>'
                    }
                ]
            }
        ],
        buttons:[{
            type:'button',
            id:'okBtn',
            label: 'Set',
            onClick: function(){
                //addCode(); //function for adding time to the source
                //alert()
                var param = $('#testname').val();
                url = "/backend.php/CKEditor/test.php?param="+param;
                $.post(url, function(response) {
                    alert(response)
                });
            }
        }, CKEDITOR.dialog.cancelButton],
    };



});