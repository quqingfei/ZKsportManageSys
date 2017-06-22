///////////////app版本管理/////////////
$(function(){
		$('#dg').datagrid({
			onLoadSuccess: function(data){
				if (data.total == 0 && data.ERROR == 'No Login!') {
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
			},
			onLoadError : function() {
				alert('出错啦');
			}
		});
		$("a.popImage").fancybox({
				            openEffect  : 'elastic',
				            closeEffect: 'elastic'    
				     });
		$('#userStatus').combobox({
            onChange: function (n,o) {
                searchUser();
            }
        });

		
	});
function chooseImage(id) {
		document.getElementById(id).click();
	}
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
				beforeSubmit: function(){
					$('#imghead').attr('src','images/loading.gif');
				},
				success : function(data) {
					data = $.parseJSON(data);
					if (data.name) {
						// alert(data.name);
						var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
						
						$("#imghidehead").attr("src", imgURL);
						$("#imghidehead").one('load',function(){							
							// if($("#imghidehead").width()==640 || $("#imghidehead").height()==276){
								$("#imghead").attr("src", imgURL);
								$("#zk_simages").val(data.name);
								$("#imghidehead").attr("src", '');
							// }else{
							// 	$.messager.alert('注意','上传的图片尺寸应该为：宽640像素*高276像素');
							// 	$('#imghead').attr('src','images/yun.png');								
							// 	return false;
							// }
						}).each(function(){
						 		if(this.complete) $(this).load();
						 	})			
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
//页面初始化
function initPage() {
	//刷新表格数据
	$('#dg').datagrid('reload');
	//清空相关参数
	$("#txt_oa").val('');
	$("#txt_ob").val('');
	$("#txt_oc").val('');
	$("#oplatform").val('');
}

//验证URL
function checkUrl(str) { 
	var strRegex = '^((https|http|ftp|itms)?://)' 
		+ '?(([0-9a-zA-Z_!~*\'().&=+$%-]+: )?[0-9a-zA-Z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
		+ '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
		+ '|' // 允许IP和DOMAIN（域名） 
		+ '([0-9a-zA-Z_!~*\'()-]+.)*' // 域名- www. 
		+ '([0-9a-zA-Z-]{0,62}.)?([0-9a-z])*.' // 二级域名 
		+ '[a-z]{2,6})' // first level domain- .com or .museum 
		+ '(:[0-9]{1,4})?' // 端口- :80 
		+ '((/?)|' // a slash isn't required if there is no file name 
		+ '(/[0-9a-zA-Z_!~*\'().;?:@&=+$,%#-]+)+/?)$'; 
	var regex = new RegExp(strRegex); 
	return regex.test(str); 
}
var consie = {
	name:"",
	cover:"",
	image:"",
	price:"",
	address:"",
	type:"",
	time:"",
	weight:"",
	totalUser:"",
	organizers:"",
	isHot:"",
	isShowApp:"",
	introduce:"",
	id:""
} 
function checkForm(){
	var i = true;
	var zhengshu = /^[1-9]\d*$/;
	var doublenum = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
	if($('#zk_sname').val().trim()){
		consie.name = $('#zk_sname').val();
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '活动名称不得为空！');
        return i = false;
	}
	if($('#zk_simages').val().trim()){
		consie.cover = $('#zk_simages').val();
		consie.image = $('#zk_simages').val();
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '活动封面不得为空！');
        return i = false;
	}
	if($('#zk_smoney').val().trim()){
		if(!doublenum.test($('#zk_smoney').val())){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '活动价格最多两位小数！');
        	return i = false;
		}else{
			consie.price = $('#zk_smoney').val();
		}		
	}else{
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '活动价格不得为空！');
        	return i = false;	
	}
	if($('#zk_saddress').val().trim()){
		consie.address = $('#zk_saddress').val();
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '活动地址不得为空！');
        return i = false;
	}
	if($('#zk_stype').val().trim()){
		consie.type = $('#zk_stype').val();
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '活动类型不得为空！');
        return i = false;
	}
	if($('#zk_stime').textbox('getValue').trim()){
		consie.time = $('#zk_stime').textbox('getValue')
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '活动时间不得为空！');
        return i = false;
	}
	if($('#zk_slevel').val().trim()){
		if(!zhengshu.test($('#zk_slevel').val())){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '权重等级为正整数！');
        	return i = false;
		}else{
			consie.weight = $('#zk_slevel').val().trim()
		}		
	}else{
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '活动等级不得为空！');
        	return i = false;
	}
	if($('#zk_speople').val().trim()){
		if(!zhengshu.test($('#zk_speople').val())){
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '总参与人数为正整数！');
        	return i = false;
		}else{
			consie.totalUser = $('#zk_speople').val().trim()
		}		
	}else{
			$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '总参与人数不得为空！');
        	return i = false;
		}
	if($('#zk_stop').val().trim()){
		consie.organizers = $('#zk_stop').val().trim()
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '主办方不得为空！');
        return i = false;
	}
	if($('#zk_shot').val()){
		consie.isHot = $('#zk_shot').val()
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择是否热门！');
        return i = false;
	}
	if($('#zk_sshow').val()){
		consie.isShowApp = $('#zk_sshow').val()
	}else{
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择是否APP展示！');
        return i = false;
	}
	 KindEditor.ready(function(K) {
        if (editor.isEmpty()) {
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '文章内容不得为空');
            return i = false;
        } else {
            consie.introduce = editor.html()
        }
    })
	consie.id = $("#idedit").val()
	return i;
}
//新增版本
function saveArticle() {
	if(checkForm()){
		if(addoredit=="add"){
			$.ajax({
				type: 'post',
				url: './AssociationAction!addTraining.zk',
				data: consie,
				dataType:'json',
				success: function(res){
					if(res.STATUS){
						$('#dlg').dialog('close');
						$('#dg').datagrid('reload');
					}
				},
				error:function(err){
					console.log(err);
				}
			})
		}else if(addoredit=="edit"){
			$.ajax({
				type: 'post',
				url: './AssociationAction!updateTraining.zk',
				data: consie,
				dataType:'json',
				success: function(res){
					if(res.STATUS){
						$('#dlg').dialog('close');
						$('#dg').datagrid('reload');
					}
				},
				error:function(err){
					console.log(err);
				}
			})
		}
		
	}else{

	}
}
function equals(v, n) {
	return (v == n);
}
function isEmpty(v) {
	return (v == null || v == '');
}

//初始化更新操作
function initUpdate() {
	 var row = $('#dg').datagrid('getSelected');
     if (row){
     	addoredit = "edit";
         $('#dlg').dialog('open').dialog('setTitle','编辑活动');
		//原始版本号
		$("#zk_sname").val(row.name);
		$("#zk_simages").val(row.cover);
		$("#imghead").attr("src","../file/FileCenter!showImage2.zk?name="+row.cover);
		$("#zk_smoney").val(row.price);
		$("#zk_saddress").val(row.address);
		$("#zk_stype").val(row.type);
		$('#zk_stime').textbox('setValue',row.time);
		$("#zk_slevel").val(row.weight)
		$("#zk_speople").val(row.totalUser);
		$("#zk_stop").val(row.organizers);
		$("#zk_shot").val(row.isHot);
		$("#zk_sshow").val(row.isShowApp);
		$(".ke-edit-iframe").contents().find(".ke-content").html( row.introduce);
		$("#idedit").val(row.id)
     }else{
    	 $.messager.alert('错误','请先选择一项!','error');
     }
}

//删除版本
function del() {
	var row = $('#dg').datagrid('getSelected');
	if(row){
		if (confirm('确定删除吗?')) {
			$.getJSON("./AssociationAction!deleteTraining.zk", {
				id: row.id
			}, function(data) {
				if (data.STATUS) {
					if(data.ERROR&&data.ERROR=='No Login!'){
                        alert('登陆超时，请重新登录!');
                        location.replace('index.html');
                    }else{
						initPage();
						showTip("成功删除!");
                    }
				} else {
					alert(data.INFO);
				}
			});
		}
		
	}else{
		 $.messager.alert('错误','请先选择一个版本!','error');
	}
}
//格式化时间
function formatDate(value){
    var d = new Date(value);   
    return  d.format("yyyy-MM-dd hh:mm:ss");    
}

//格式化版本信息
function formatVersion(a,row) {
  var a = a;
  var b = row.b;
  var c = row.c;
  var p = row.platform ;
  var platform = 'IOS系统';
  var img = 'wttp_huo_2';
  if (p == 'a') {
      platform = 'Android系统';
  }
  var str = "["+platform+"]<span>版本"+a+"."+b+"."+c+"</span></a>";
  return str;
}
var addoredit = null;
function newAppVersion(){
    	addoredit = "add";
    	$("#zk_sname").val("");
		$("#zk_simages").val("");
		$("#imghead").attr("src","images/yun.png");
		$("#zk_smoney").val("");
		$("#zk_saddress").val("");
		$("#zk_stype").val("");
		$('#zk_stime').textbox('setValue',"");
		$("#zk_slevel").val("")
		$("#zk_speople").val("");
		$("#zk_stop").val("");
		$("#zk_shot").val("y");
		$("#zk_sshow").val("y");
		$("#idedit").val("")
		$(".ke-edit-iframe").contents().find(".ke-content").html('');
    $('#dlg').dialog('open').dialog('setTitle','添加活动');
}
function into(){
	$('#into').click();
}
$('#into').change(function(){
	$.ajax({
		type:'post',
		url: './AssociationAction!updateTrainingOrderStateForExcel.zk',
		data:{fileList:$('#into').val()},
		dataType:'json',
		success: function(res){
			if(res.STATUS){

			}else{
				alert(res.INFO);
			}
		}
	})
})
function outto(){
	$('#dlgame').dialog('open').dialog('setTitle','比赛导出EXCEL');
}
function outtosubmit(){
	var s = $('input[name=status]:checked').val();
	window.open("http://"+window.location.host+"/fatburn/manage/AssociationAction!writeTrainingUserToExcel.zk?checkStatus="+s); 
	$('#dlgame').dialog('close');
}
function searchBox(){
	$("#dg").datagrid('load',{name:$('#txt_keyword').val()});
}
//格式化封面
function formatCover(cover){
    //var result = "<a class=\"popImage\" href=\"../file/FileCenter!showImage2.zk?name="+cover+"\">点击查看</a>";
    var result = "<a class=\"popImage\" href=\"../file/FileCenter!showImage2.zk?name="+cover+"\"><img src=\"../file/FileCenter!showImage2.zk?name="+cover+"\" style=\"height:20px;display: block; margin: 0 auto;\" title=\"点击查看大图\"></a>";
    return result;
}
function formatNY(e){
	var i = null;
	if(e=="y"){
		i = "是"
	}else{
		i = "否"
	}
	return i;
}
//编辑器开始
var editor;
KindEditor.ready(function(K) {
    // 自定义插件 #1
    KindEditor.lang({
        example1: '插入HTML'
    });
    KindEditor.plugin('example1', function(K) {
        var self = this,
            name = 'example1';
        self.clickToolbar(name, function() {
            chooseImage('file_title_img2');
        });
    });

    editor = K.create('#editor_id', {
        resizeType: 1,
        allowPreviewEmoticons: false,
        allowImageUpload: true,
        autoHeightMode: false,
        height: "440px",
        items: [
            'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
            'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
            'insertunorderedlist', '|', 'emoticons', 'link', 'source', 'example1'
        ],
    });
    $(".ke-container-default").css({
        "width": "630px"
    });
});

KindEditor.ready(function(K) {
    K('input[name=getHtml]').click(function(e) {
        alert(editor.html());
    });
    K('input[name=isEmpty]').click(function(e) {
        alert(editor.isEmpty());
    });
    K('input[name=getText]').click(function(e) {
        alert(editor.text());
    });
    K('input[name=selectedHtml]').click(function(e) {
        alert(editor.selectedHtml());
    });
    K('input[name=setHtml]').click(function(e) {
        editor.html('<h3>Hello KindEditor</h3>');
    });
    K('input[name=setText]').click(function(e) {
        editor.text('<h3>Hello KindEditor</h3>');
    });
    K('input[name=insertHtml]').click(function(e) {
        editor.insertHtml('<strong>插入HTML</strong>');
    });
    K('input[name=appendHtml]').click(function(e) {
        editor.appendHtml('<strong>添加HTML</strong>');
    });
    K('input[name=clear]').click(function(e) {
        editor.html('');
    });
});
function msgLoading(close) {
	var loading = '<div id="loadingCir" style="position:absolute;z-index:9999;background-color:#fff;opacity:0.5;top:0;left:0;right:0;bottom:0;"><img style="display:block;position:absolute;width:30px;margin-left:-15px;margin-top:-15px;left:50%;top:50%;" src="js/themes/common/loading.gif" alt="" /></div>';
	if (close == 'close') {
		$('#loadingCir').remove();
	} else {
		$('body').append(loading);
	}
}
function uploadImage2() {
    var viewFiles = document.getElementById("file_title_img2");
    //是否为图片类型            
    if (/image\/\w+/.test(viewFiles.files[0].type)) {
        //最大图片文件大小 500KB
        var imgSizeLimit = 5000 * 1024;
        if (viewFiles.files[0].size <= imgSizeLimit) {
            //上传图片
            $("#title_img_form2")
                .ajaxSubmit({
                    type: 'post',
                    url: '../file/FileCenter!upload.zk',
                    cache: false,
                    beforeSubmit: function() {
                        msgLoading();
                    },
                    success: function(data) {
                        data = $.parseJSON(data);
                        if (data.name) {
                            var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
                            KindEditor.ready(function(K) {
                                K.insertHtml('#editor_id', '<img class="img" src="' + imgURL + '" />');
                            })
                            msgLoading('close');
                        } else {
                            //alert("上传图片出错！");
                            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上传图片出错！');
                            msgLoading('close');
                        }
                        $("#title_img_form2").resetForm();

                    },
                    error: function(XmlHttpRequest, textStatus, errorThrown) {
                        //alert("error");
                        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', 'error');
                    }
                });
        } else {
            //alert("图片大小不能超过" + (imgSizeLimit / 1024) + "KB!");
            $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', "图片大小不能超过" + (imgSizeLimit / 1024) + "KB!");
            msgLoading('close');
        }
    } else {
        //alert('请选择图片类型的文件!');
        $.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请选择图片类型的文件!');
    }
}

function uploadExl() {
	if (!!$('#file_title').val()) {
		msgLoading();
		$("#file_form").ajaxSubmit({
			type: 'post',
			url: './AssociationAction!updateTrainingOrderStateForExcel.zk',
			success: function(data) {
				data = eval('(' + data + ')');
				msgLoading('close');
				if (data.STATUS) {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;成功', data.INFO);
				} else {
					$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', data.INFO);
				}
			},
			error: function(XmlHttpRequest, textStatus, errorThrown) {
				//alert("error");
				msgLoading('close');
				$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '上传失败，请稍后重试！');
			}
		});
	} else {
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择要上传的文件');
	}
}
var mid = null;
function showuser(){
	var row = $('#dg').datagrid('getSelected');
	if(row){
		mid = row.id;
   		$('#dguser').datagrid({
   			url : 'AssociationAction!getTrainingUser.zk',
   			queryParams : {trainingId:row.id }
   		});
		$('#dluser').dialog('open').dialog('setTitle','学员列表');
	}else{
		 $.messager.alert('错误','请先选择一个!','error');
	}
	
}
function searchUser(){
    var searchName = $('#userkeyword').val();
    var searchState = $('#userStatus').combobox('getValue');
    var phoneNumber = null,name = null;
    if(/^[0-9]*$/.test(searchName)){
    	phoneNumber = searchName;
    }else{
    	name = searchName;
    }
    $("#dguser").datagrid('load',{checkStatus:searchState,name:name,phone:phoneNumber,trainingId:mid});
}
function formatSex(value){
	if(value == "M"){
		return "男";
	}else{
		return "女";
	}
}
function formatStatus(value,row){
	var i = "-"
	if(value==0){
		i = "<select id='sdr' onChange='status(this)' gs="+row.id+"><option value='0'>审核中</option><option value='1'>已审核</option><option value='2'>审核失败</option></select>";
	}
	if(value==1){
		i = "<select id='sdr' onChange='status(this)' gs="+row.id+"><option value='1'>已审核</option><option value='0'>审核中</option><option value='2'>审核失败</option></select>";
	}
	if(value==2){
		i = "<select id='sdr' onChange='status(this)' gs="+row.id+"><option value='2'>审核失败</option><option value='0'>审核中</option><option value='1' >已审核</option></select>"
	}
	return i;
}
function status(e){
	$.ajax({
		type:'post',
		dataType:"json",
		url:'/fatburn/manage/AssociationAction!updateStateForTtainingOrder.zk',
		data:{trainingOrderId:$(e).attr('gs'),checkStatus:$(e).val()},
		success: function(res){
			showTip(res.INFO);
		}
	})
}
function formatPay(value){
	var i = "-"
	if(value==0){
		i = "未支付"
	}
	if(value==1){
		i = "已支付"
	}
	if(value==2){
		i = "支付失败"
	}
	return i;
}