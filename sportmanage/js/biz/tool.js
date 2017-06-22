$(function(){
    $('#dg').datagrid({
        onLoadSuccess: function(data){
            if (data.total == 0 && data.ERROR == 'No Login!') {
                //$.messager.alert('信息提示', '登录超时,请重新登录!', 'error');
                //showError('登录超时,请重新登录!');
                //relogin();
                var user_id =  localStorage.getItem('user_id');
                var user_pwd = localStorage.getItem('user_pwd');
                if(user_id==''||!user_id||user_pwd==''||!user_pwd){
                    $.messager.alert('信息提示', '登录超时,请重新登录!', 'error');
                    relogin();
                }
                else{
                    $.post('loginAction!login1.zk',{user_id:user_id,user_pwd:user_pwd},function(data){
                        if(data.STATUS){
                            $('#dg').datagrid('reload');
                        }
                    },'json').complete(function(){
                        $('#dg').datagrid('reload');
                    });
                }
            }
            //图片弹出层
            $("a.popImage").fancybox({
                openEffect  : 'elastic',
                closeEffect: 'elastic'
            });
        },
        onLoadError : function() {
            alert('出错啦');
        }
    });


    $('#searchState').combobox({
        //data : [] ,
        onChange: function (n,o) {
            searchUser();
        }

    });

    //withdrawBtn
    $.post('GymWithdrawAction!getWait.zk',{},function(data){
        var $wdb = $('#withdrawBtn');
        if(data.STATUS && data.total){
            $wdb.text(data.total);
            $wdb.show();
        }else{
            $wdb.hide();
        }
    },'json');
});


/**
 *显示消息提示
 */
function showTip(msg) {
    $.messager.show({
        title : "消息",
        timeout:2000,
        msg : msg
    });
}

/* 	function note(){
 var row = $('#dg').datagrid('getSelected');

 if(!row){
 $.messager.alert('错误','请先选择!');
 return;
 }
 location.href = 'courseNote.html?courseId='+row.id;
 } */


function del(){
    var row = $('#dg').datagrid('getSelected');
    if(!row){
        //$.messager.alert('错误','请先选择!');
        showError('请先选择健身房!');
        return;
    }
    if(confirm("确定删除?")){
        $.getJSON('GymAction!delete.zk',{id:row.id},function(data){
            if(data.STATUS){
                $('#dg').datagrid('reload');
                showTip("删除成功!");
            }else {
                showTip("删除失败!");
            }
        });
    }
}


var uploadImages = [];
var certificate;//证书字符串
var url;
var gymID=null;//标记客服是否存在
var certificateName=[];
var update=0;//标记是否为修改证书照片

//新增
function newProduct(){
    gymID = null;
    var div = document.getElementById("image_container");
    while(div.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        div.removeChild(div.firstChild);
    }
    $("#imghead").attr("src", 'images/add.png');
    //$("#coachCertificate").show();
    $('#fm').form('clear');
    $('#isOfficial').combobox('setValue','y');
    $("#image_container").empty();
    $("#imghead").siblings().remove();
    openDialog('dlg', '编辑健身房信息');
    url = 'GymAction!save.zk';

}
//更新产品信息
function editProduct(){
    var div = document.getElementById("image_container");
    while(div.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        div.removeChild(div.firstChild);
    }

    var row = $('#dg').datagrid('getSelected');
    if (!row){
        showError('请先选择要编辑的健身房!');
        return;
    }
    gymID = row.id;
    openDialog('dlg', '编辑健身房信息');
    $('#fm').form('load',row);
    $("#certification").val("");
    url = 'GymAction!update.zk?id='+row.id;
    //加载证书
    certificate = eval('('+row.certification+')');
    for (var i=0;i<certificate.length;i++){
        uploadImages[i] = certificate[i].image;
        certificateName[i] = certificate[i].name;//获取证书名称
    }
    for(var i = 0 ; i < uploadImages.length ;i++){
        var imgURL = "../file/FileCenter!showImage2.zk?name=" + uploadImages[i];
        var id = uploadImages[i].split(".")[0];
        add(id);
        $("#"+id).attr("src", imgURL);
        $("#"+id).attr("alt", uploadImages[i]);
        $("#"+id+"name").val(certificateName[i]);
    }

    //编辑封面
    $("#imghead").siblings().remove();
    var imgs = [];
    gymcover = [];
    var covers = $.parseJSON(row.cover);
    for(var i =  0 ;i<covers.length;i++){
        var coverId = 'edit' + i ;
        var imgURL = "../file/FileCenter!showImage2.zk?name=" + covers[i] ;
        var img = '<div style="position: relative;float: left;"><img id="'+coverId+'" src="'+imgURL+'" onmouseover="showCoverDel(\''+coverId+'\')" onmouseout="hideCoverDel(\''+coverId+'\')" onclick="chooseImage(\'file_title_img\',\''+coverId+'\')" style="width: 77px; height: 77px;margin:2px;cursor:pointer;" /><div id="del_'+coverId+'" onmouseover="showCoverDel(\''+coverId+'\')" onmouseout="hideCoverDel(\''+coverId+'\')"  onclick="delCover(\''+coverId+'\')" style="position: absolute; top: 5px; left: 70px;  color: #f00;cursor:pointer ;display:none;  border: 1px #ccc solid;">X</div></div>';
        //console.log('img html:'+img);
        imgs.push(img);
        var coverJSON = {
            "id" : coverId ,
            "img" : covers[i]
        };
        gymcover.push(coverJSON);
    }

    // console.log(imghtml);

    $("#imghead").before(imgs.join(''));
}
//check form
function checkForm(){
    var name = $.trim($("#gymName").val());
    if(name==''){
        $.messager.alert('警告','健身房名称不能为空!');
        $("#gymName").focus();
        return false;
    }
    var admin = $.trim($("#admin").val());
    if(admin==''){
        $.messager.alert('警告','教练法人不能为空!');
        $("#admin").focus();
        return false;
    }
    var list = document.getElementById("image_container").getElementsByTagName("input");
    if(list.length>0){
        //alert(list.length);
        var i=0;
        while(i<list.length){
            var id = list.item(i).id;
            if($.trim($("#"+id).val())==''){
                alert('证书名称为空！');
                $("#"+id).focus();
                return ;
            }
            i=i+1;
        }

    }
    return true;
}
function saveProduct(){
    if(checkForm()){
        var name = $.trim($("#gymName").val());
        //将证书名称保存到数据库
        var formImages = "";
        var imgObjArr = [];
        var listInput = document.getElementById("image_container").getElementsByTagName("input");
        var listImg = document.getElementById("image_container").getElementsByTagName("img");
        //alert(listImg.length+"--"+listInput.length);
        if(listInput.length  > 0 ){
            for(var i = 0 ; i < listInput.length ;i++){
                var imgObj = {"name":$.trim($("#"+listInput.item(i).id).val()), "image":listImg.item(i).alt};//$.trim($("#"+listInput.item(i).id).val)
                imgObjArr.push(imgObj);
            }
            formImages = JSON.stringify(imgObjArr);
        }

        $("#certification").attr("value","");
        $("#certification").val(formImages);
        //alert($("#certification").val()+"--"+formImages);
        $('#fm').form('submit',{
            url: url,
            onSubmit: function(){
                return checkForm();
            },
            success: function(result){
                var result = $.parseJSON( result );
                if (result.STATUS){
                    $('#dlg').dialog('close');
                    $('#dg').datagrid('reload');

                    $("#image_container").empty();
                    $("#imghead").attr("src", 'images/add.png');
                } else {
                    showError(result.INFO);
                }
            }
        });
        /*     		$.getJSON('GymAction!checkGymName.zk',{name:name},function(data){
         if(data.STATUS && data.id!=gymID){
         showError('健身房已经存在!');
         }else {

         }

         }); */


    }

}

function search(value){
    $("#dg").datagrid('load',{title:value});
}

//显示删除图标
function showDeleteDiv(id){
    $("#"+id+"DIV").css("display","block");
}

function hideDeleteDiv(resourceCode){
    $("#"+resourceCode+"DIV").css("display","none");
}

//移除图片
function removeImage(id) {
    $("#"+id).parent().parent().detach();
    event.stopPropagation();
}


function add(id){
    var fatherDiv = document.getElementById("image_container");
    var div = document.createElement("div");
    $(div).attr({
        'id' :id+'div',
        'class' : 'certificateList'
    });
    fatherDiv.appendChild(div);
    var input = document.createElement("input");
    $(input).attr({
        'id' :id+'name',
        'class' : 'certificateName'
    });
    div.appendChild(input);
    var imgDiv = document.createElement("div");
    $(imgDiv).attr({
        'id' :id+'imgDiv',
        'class' : 'add'	,
        'onclick':'chooseImage1("'+id+'")',
        'onmouseover':'showDeleteDiv("'+id+'")',
        'onmouseout':'hideDeleteDiv("'+id+'")'
    });

    div.appendChild(imgDiv);
    var img = document.createElement("img");
    $(img).attr({
        'id' :id,
        'class':"img",
        'src':"images/add.png"
    });
    imgDiv.appendChild(img);
    //增加删除图标
    var $image = $("#"+id);
    var divObj=$("<div onclick=removeImage('"+id+"')  onmouseover=\"showDeleteDiv('"+id+"')\""+" onmouseout=\"hideDeleteDiv('"+id+"')\">×</div>");
    divObj.addClass("divX");
    divObj.attr("id",id+"DIV");
    divObj.attr("title","删除图片"+id);
    //alert($image.position());
    divObj.css({position:"absolute",cursor:"pointer", color:"red",border:"1px solid #c1c1c1", width:"12px", height:"12px",  left:33, top:0});
    $image.parent().append(divObj);
}

function up(oldId,newId){
    $('#'+oldId+'div').attr({
        'id' :newId+'div',
    });
    $('#'+oldId+'name').attr({
        'id' :newId+'name',
    });
    $('#'+oldId+'imgDiv').attr({
        'id' :newId+'imgDiv',
        'class' : 'add'	,
        'onclick':'chooseImage1("'+newId+'")',
        'onmouseover':'showDeleteDiv("'+newId+'")',
        'onmouseout':'hideDeleteDiv("'+newId+'")'
    });
    $('#'+oldId).attr({
        'id' :newId
    });
    var deleteDiv = $('#'+oldId+'DIV');
    $(deleteDiv).attr({
        'id':newId+"DIV",
        'onclick':'removeImage("'+newId+'")',
        'onmouseover':'showDeleteDiv("'+newId+'")',
        'onmouseout':'hideDeleteDiv("'+newId+'")'
    });
}
function chooseImage1(id) {
    update=id;
    document.getElementById("image_file").click();
}

var curcoverId = null;
function chooseImage(id,coverId) {
    //alert('choose image...');
    /*  alert(e); */
    if(gymcover && gymcover.length >= 6){
        showError('最多上传6张图片');
        return ;
    }

    update=0;
    curcoverId = coverId;
    document.getElementById(id).click();

    var e=event || window.event;
    if (e && e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
}



//上传证书
function uploadCertificate(){
    //alert('upload');
    var viewFiles = document.getElementById("image_file");
    //是否为图片类型
    if(/image\/\w+/.test(viewFiles.files[0].type)){
        //最大图片文件大小 500KB
        var imgSizeLimit = 500 * 1024;
        if(viewFiles.files[0].size<=imgSizeLimit){
            //上传图片
            $("#image_form").ajaxSubmit({
                type : 'post',
                url : '../file/FileCenter!uploadImage2.zk',
                success : function(data) {
                    //data = $.parseJSON(data);
                    data = eval("(" + data + ")");
                    if (data.name){
                        //alert(data.name);
                        var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
                        var id = data.name.split(".")[0];
                        if(update==0){
                            add(id);
                        }else{
                            //alert(id+"-------"+update);
                            /*
                             var imgDiv =  $('#'+update+'imgDiv');
                             $(imgDiv).attr({
                             'onclick':'chooseImage1("'+id+'")',
                             });
                             var deleteDiv = $('#'+update+'DIV');
                             $(deleteDiv).attr({
                             'onclick':'removeImage("'+id+'")',
                             });
                             $('#'+update).attr("id",id);*/
                            up(update,id);
                        }
                        $("#"+id).attr("src", imgURL);
                        $("#"+id).attr("alt", data.name);

                    } else {
                        alert("上传图片出错！");
                    }
                    //$("#title_img_form").resetForm();
                    $("#image_form").resetForm();
                },
                error : function(XmlHttpRequest, textStatus, errorThrown) {
                    alert("error");
                }
            });
        }else{
            alert("图片大小不能超过"+(imgSizeLimit/1024)+"KB!");
        }
    }else{
        alert('请选择图片类型的文件!');
    }
}


function showCoverDel(id){
    //alert(e);
    /*       var e=event || window.event;
     if (e && e.stopPropagation){
     e.stopPropagation();
     }else{
     e.cancelBubble = true;
     } */
    $('#del_'+id).toggle();
    //console.log('show del div>');
}
function hideCoverDel(id){
    /*       var e=event || window.event;
     if (e && e.stopPropagation){
     e.stopPropagation();
     }else{
     e.cancelBubble = true;
     } */
    $('#del_'+id).toggle();
}
function delCover(id){
    //alert('del:'+id);
    //console.log('before del:'+gymcover);
    $("#"+id).parent().remove();
    var tmp = [];
    for(var i = 0 ;i<gymcover.length;i++){
        var cv = gymcover[i];
        if(cv.id != id){
            tmp.push(cv);
        }
    }
    gymcover = tmp ;

    //console.log('del:'+gymcover);
    resetCover(gymcover);
}

/**
 *	重设cover值
 **/
function resetCover(gymcover){
    var coverimgs = [];
    for(var i = 0 ;i<gymcover.length;i++){
        var cv = gymcover[i];
        coverimgs.push(cv.img);
    }
    $('#cover').val(JSON.stringify(coverimgs));
}

var gymcover = [];
//上传文章图片
function uploadImage(){
    //alert('upload');
    var viewFiles = document.getElementById("file_title_img");
    //是否为图片类型
    if(/image\/\w+/.test(viewFiles.files[0].type)){
        //最大图片文件大小 500KB
        var imgSizeLimit = 500 * 1024;
        if(viewFiles.files[0].size<=imgSizeLimit){
            //上传图片
            $("#title_img_form").ajaxSubmit({
                type : 'post',
                url : '../file/FileCenter!uploadImage2.zk',
                success : function(data) {
                    data = $.parseJSON(data);
                    if (data.name) {
                        // alert(data.name);

                        var coverId = 'cover' + $.now() ;
                        if(curcoverId){
                            coverId = curcoverId ;
                        }

                        var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
                        var img = '<div style="position: relative;float: left;"><img id="'+coverId+'" src="'+imgURL+'" onmouseover="showCoverDel(\''+coverId+'\')" onmouseout="hideCoverDel(\''+coverId+'\')" onclick="chooseImage(\'file_title_img\',\''+coverId+'\')" style="width: 77px; height: 77px;margin:2px;cursor:pointer;" /><div id="del_'+coverId+'" onmouseover="showCoverDel(\''+coverId+'\')" onmouseout="hideCoverDel(\''+coverId+'\')"  onclick="delCover(\''+coverId+'\')" style="position: absolute; top: 5px; left: 70px;  color: #f00;cursor:pointer ;display:none;  border: 1px #ccc solid;">X</div></div>';
                        if(curcoverId){

                            $("#"+curcoverId).attr('src',imgURL);
                            for(var i = 0 ;i<gymcover.length;i++){
                                var cv = gymcover[i];
                                if(cv.id == coverId){
                                    cv.img = data.name ;
                                }
                            }
                        }else{
                            $("#imghead").before(img);
                            var coverJSON = {
                                "id" : coverId ,
                                "img" : data.name
                            };
                            gymcover.push(coverJSON);

                        }
                        //console.log('封面：'+JSON.stringify(gymcover));

                        resetCover(gymcover);
                        /*  var coveimgheadrimgs = [];
                         for(var i = 0 ;i<gymcover.length;i++){
                         var cv = gymcover[i];
                         coverimgs.push(cv.img);

                         }
                         $('#cover').val(JSON.stringify(coverimgs)); */
                        //$("#imghead").attr("src", imgURL);
                        //$("#cover").val(data.name);

                    } else {
                        alert("上传图片出错！");
                    }
                    $("#title_img_form").resetForm();
                },
                error : function(XmlHttpRequest, textStatus, errorThrown) {
                    alert("error");
                }
            });
        }else{
            alert("图片大小不能超过"+(imgSizeLimit/1024)+"KB!");
        }
    }else{
        alert('请选择图片类型的文件!');
    }
}


function formatCertificate(certificate1){
    if(!certificate1){
        return '';
    }
    certificate1 = $.parseJSON(certificate1);
    var result="";
    for(var i = 0 ; i < certificate1.length ;i++){
        var prex = "";
        if(i > 0){
            prex = " | ";
        }
        result = result + prex + "<a class=\"popImage\" href=\"../file/FileCenter!showImage2.zk?name="+certificate1[i].image+"\">"+"查看</a>";
    }
    return result;
}

//格式化封面
function formatCover(cs){
    var covers = $.parseJSON(cs);
    var results = [];
    for(var i = 0 ;i<covers.length;i++){
        var cover = covers[i];
        var result = "<a class=\"popImage\" href=\"../file/FileCenter!showImage2.zk?name="+cover+"\">查看</a>";
        if(i < covers.length - 1){
            result += ' | ';
        }
        results.push(result);
    }
    return results.join('');
}
//格式化URL
function formatVideoURL(url){
    var result = "<a href=\"javascript:void(0)\" onClick=\"playVideo('"+url+"')\" >点击播放</a>";
    return result;
}

//打开分成管理对话框
function toBenefitDig(){
    var row = $('#dg').datagrid('getSelected');
    if(!row){
        showError('请先选择健身房');
        return ;
    }
    $('#benefitdg').datagrid({
        url : 'GymBenefitAction!list.zk',
        queryParams : { gymId : row.id  }
    });
    $('#gymId').val(row.id);
    $('#benefitdlg').dialog('open').dialog('setTitle','分成管理');
}


//新增分成
function newBenefit(){
    $('#scope').combobox({
        valueField:'id',
        textField:'text',
        onSelect: function(rec){
            var type = rec.id ;
            if(type == 'product'){
                $('#courseDiv').hide();
                $('#productDiv').show();
                $('#products').combobox({
                    valueField : 'id' ,
                    textField : 'text',
                    multiple:true,
                    url : 'productAction!getPrductNames.zk'
                });
            }
            if(type == 'course'){
                $('#productDiv').hide();
                $('#courseDiv').show();
                $('#courses').combobox({
                    valueField : 'id' ,
                    textField : 'text',
                    multiple:true,
                    url : 'CourseAction!getCourseNames.zk'
                });
            }
            if(type == 'order'){
                $('#productDiv').hide();
                $('#courseDiv').hide();
            }
        }
    });
    $('#newBenefitdlg').dialog('open').dialog('setTitle','编辑');
}

//保存分成
function saveBenefit(){
    var  gymId = $('#gymId').val();
    var scope = $('#scope').combobox('getValue');
    var targetName = '' ;
    if(scope == 'course'){
        var courses  = $('#courses').combobox('getText');
        targetName = courses ;
    }
    if(scope == 'product'){
        var products  = $('#products').combobox('getText');
        targetName = products ;
    }
    var benefitRate = $('#detailBenefitRate').numberbox('getValue');
    var gymBenefitId = $('#gymBenefitId').val();
    //alert('rate:'+benefitRate); return;
    var postData = {
        gymId : gymId ,
        scope : scope ,
        targetName : targetName ,
        benefitRate : benefitRate ,
        gymBenefitId : gymBenefitId
    };
    $.post('GymBenefitAction!saveOrUpdate.zk',postData,function(data){
        if(data.STATUS){
            $('#newBenefitdlg').dialog('close');
            $('#benefitdg').datagrid('reload');
        }else{
            showError(data.INFO);
        }
    },'json');
}

//删除分成
function delBenefit(){
    var $benefitdg = $('#benefitdg');
    var row = $benefitdg.datagrid('getSelected');
    if(!row){
        showError('请先选择分成项!');
        return ;
    }
    confirmDialog('确定删除吗', function(){
        $.post('GymBenefitAction!delete.zk',{id:row.id},function(data){
            if(data.STATUS){
                //$('#newBenefitdlg').dialog('close');
                $benefitdg.datagrid('reload');
            }else{
                showError(data.INFO);
            }
        },'json');
    });
}

//编辑分成
function editBenefit(){
    var $benefitdg = $('#benefitdg');
    var row = $benefitdg.datagrid('getSelected');
    if(!row){
        showError('请先选择分成项!');
        return ;
    }
    /* 	   	$('#scope').combobox({
     valueField:'id',
     textField:'text',
     onSelect: function(rec){
     var type = rec.id ;
     if(type == 'product'){
     $('#courseDiv').hide();
     $('#productDiv').show();
     $('#products').combobox({
     valueField : 'id' ,
     textField : 'text',
     multiple:true,
     url : 'productAction!getPrductNames.zk'
     });
     }
     if(type == 'course'){
     $('#productDiv').hide();
     $('#courseDiv').show();
     $('#courses').combobox({
     valueField : 'id' ,
     textField : 'text',
     multiple:true,
     url : 'CourseAction!getCourseNames.zk'
     });
     }
     if(type == 'order'){
     $('#productDiv').hide();
     $('#courseDiv').hide();
     }
     }
     }); */
    $('#scope').combobox({
        valueField:'id',
        textField:'text',
    }).combobox('disable');
    var scope = row.scope ;
    $('#scope').combobox('setValue',scope);
    if(scope == 'course'){
        $('#productDiv').hide();
        $('#courseDiv').show();
        $('#courses').combobox({
            valueField : 'id' ,
            textField : 'text',
            multiple:true,
            url : 'CourseAction!getCourseNames.zk'
        }).combobox('setText',row.targetName);
    }
    if(scope == 'product'){
        $('#courseDiv').hide();
        $('#productDiv').show();
        $('#products').combobox({
            valueField : 'id' ,
            textField : 'text',
            multiple:true,
            url : 'productAction!getPrductNames.zk'
        }).combobox('setText',row.targetName);
    }
    $('#detailBenefitRate').numberbox('setValue',row.benefitRate);
    $('#gymBenefitId').val(row.id);
    $('#newBenefitdlg').dialog('open').dialog('setTitle','编辑');

}

function formaterScope(v){
    switch (v) {
        case 'course': return '课程';
        case 'product': return '产品';
        case 'order': return '订单';
        default: return '';
    }
}

//提现对话框
function towithdraw(){
    location.href = 'gymWithdraw.html';
}

function searchUser(){
    //alert('search');
    var searchKey = $('#searchKey').textbox('getValue');
    var searchState = $('#searchState').combobox('getValue');
    $("#dg").datagrid('load',{keyword:searchKey,state:searchState});
}

//审核健身房信息
function toCheckGym(){
    //alert('check');
    var row = $('#dg').datagrid('getSelected');
    if(!row){
        showError('先选择健身房');
        return ;
    }
    $('#checkGymId').val(row.id);
    $('#checkGymName').text(row.gymName ? row.gymName : '' );
    $('#checkAdmin').text(row.admin ? row.admin : '');
    $('#checkAdminPhone').text(row.adminPhone ? row.adminPhone : '');
    $('#checkzfbAccount').text(row.zfbAccount ? row.zfbAccount : '');
    $('#checkzfbName').text(row.zfbName ? row.zfbName : '');
    $('#checkaddress').text(row.address ? row.address : '');
    $('#checkdescription').text(row.description ? row.description : '');
    $('#checkBizNo').text(row.businessLicense ? row.businessLicense : '');
    if(row.state == 'fail'){
        $('#checkresult').text('未通过审核,理由:' + (row.reason ? row.reason : '') );
    }else if(row.state == 'normal'){
        $('#checkresult').text('已通过审核!');
    }else{
        $('#checkresult').text('');
    }

    var ceHTMLs = [];
    var ces = $.parseJSON(row.certification);
    for(var i = 0;i<ces.length;i++){
        var ce = ces[i];
        var img = '../file/FileCenter!showImage2.zk?name=' + ce.image;
        var ceHtml = '<div><a href="'+img+'" class="popImage" title="点击查看大图"><img src="'+img+'" style="width:208px;height:208px;"></a><span>'+ce.name+'</span></div>';
        ceHTMLs.push(ceHtml);
    }
    $('#checkCes').html(ceHTMLs.join(''));

    var csHtmls = [];
    var covers = $.parseJSON(row.cover);
    for(var i = 0 ;i<covers.length;i++){
        var img = '../file/FileCenter!showImage2.zk?name=' + covers[i];
        var csHtml = '<div><a href="'+img+'" class="popImage" title="点击查看大图"><img src="'+img+'" style="width:208px;height:208px;"></a></div>';
        csHtmls.push(csHtml);
    }
    $('#checkcovers').html(csHtmls.join(''));

    $("a.popImage").fancybox({
        openEffect  : 'elastic',
        closeEffect: 'elastic'
    });
    openDialog('gymCheckdlg', '审核健身房信息');
}

function postCheckInfo(gymId,f,r){
    $.post('GymAction!check.zk',{gymId:gymId,flag:f,reason:r},function(data){
        if(data.STATUS){
            closeDialog('gymCheckdlg');
            $('#dg').datagrid('reload');
        }else{
            showError(data.INFO);
        }
    },'json');
}

function saveNoPass(){
    var gymId = $('#checkGymId').val();
    var r = $('#gymCheckReason').textbox('getValue');

    $.post('GymAction!check.zk',{gymId:gymId,flag:0,reason:r},function(data){
        if(data.STATUS){
            closeDialog('checkReasonDlg');
            closeDialog('gymCheckdlg');
            $('#dg').datagrid('reload');
        }else{
            showError(data.INFO);
        }
    },'json');
}

//保存审核信息
function saveCheck(f){
    var gymId = $('#checkGymId').val();
    if(f){
        postCheckInfo(gymId , f , '');
    }else{
        openDialog('checkReasonDlg', '填写审核不通过理由');
    }
}

function toListCards(){
    var row = $('#dg').datagrid('getSelected');
    if(!row){
        showError('先选择健身房');
        return ;
    }
    var gymId = row.id ;
    $('#cardDg').datagrid({
        url : 'GymAction!listCards.zk',
        queryParams : {
            gymId : gymId
        }
    });
    $('#cardDlg').dialog('open').dialog('setTitle','会员卡列表');
}

function formatUser(v,row){
    return '<a href="javascript:void(0)" onclick="showUsers(\''+row.id+'\')">'+v+'</a>';
}

function showUsers(gymId){
    //var gymId = row.id ;
    $('#userDg').datagrid({
        url : 'GymAction!listUsers.zk',
        queryParams : {
            gymId : gymId
        }
    });
    $('#userDlg').dialog('open').dialog('setTitle','用户列表');
}

function toGymPwd(){
    var row = $('#dg').datagrid('getSelected');
    if(!row){
        showError('先选择健身房');
        return ;
    }
    $('#gymAccountId').val('');
    $('#gymLoginName').textbox('setValue','');
    $('#gymLoginPwd').textbox('setValue','');

    var gymId = row.id ;
    $.post('GymAction!getGymAdmin.zk',{gymId:gymId},function(data){
        if(data.STATUS){
            var admin = data.admin;
            if(admin){
                $('#gymAccountId').val(admin.id);
                $('#gymLoginName').textbox('setValue',admin.loginName);
            }
        }
    },'json');
    $('#gymPwdDlg').dialog('open').dialog('setTitle','重置密码');
}

function saveGymPwd(){
    var loginName = $('#gymLoginName').textbox('getValue');
    var loginPwd = $('#gymLoginPwd').textbox('getValue');
    if(!loginName){
        showError('用户名不能为空');
        return ;
    }
    if(!loginPwd){
        showError('密码不能为空');
        return ;
    }
    var gaId = $('#gymAccountId').val();
    $.post('GymAction!resetPwd.zk',{gaId:gaId,loginName:loginName,loginPwd:loginPwd},function(data){
        if(data.STATUS){
            $('#gymPwdDlg').dialog('close');
        }else{
            showError(data.INFO);
        }
    },'json');
}
