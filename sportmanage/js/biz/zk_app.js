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
		
	});
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

//新增版本
function newVersion() {
	var oa = $.trim($("#txt_oa").val());
	var ob = $.trim($("#txt_ob").val());
	var oc = $.trim($("#txt_oc").val());
	var oplatform = $.trim($("#oplatform").val());
	var a = $.trim($("#txt_a").val());
	var b = $.trim($("#txt_b").val());
	var c = $.trim($("#txt_c").val());
	var platform = $.trim($("#sl_platform").val());
	var url = $.trim($("#txt_url").val());
	var note = $.trim($("#tf_note").val());
	if (isEmpty(a)) {
		alert('版本号不能为空!');
		return;
	}
	if (isEmpty(b)) {
		alert('版本号不能为空!');
		return;
	}
	if (isEmpty(c)) {
		alert('版本号不能为空!');
		return;
	}
	if (equals(platform, '选择平台')) {
		alert('请选择平台!');
		return;
	}
	if (isEmpty(url)) {
		alert('下载链接不能为空!');
		return;
	}
	if(!checkUrl(url)){
		alert('请填写正确的下载链接!');
        return;
	}
	if (isEmpty(note)) {
		alert('版本更新说明不能为空!');
		return;
	}
	var postData = {
		a : a,
		b : b,
		c : c,
		platform : platform,
		url : url,
		note : note,
		module : 'add'
	};
	var msg = "成功添加新版本!";
	if (!isEmpty(oa) && !isEmpty(ob) && !isEmpty(oc) && !isEmpty(oplatform)) {
	    msg = "成功更新版本信息!";
		postData = {
			a : a,
			b : b,
			c : c,
			oa : oa,
			ob : ob,
			oc : oc,
			oplatform : oplatform,
			platform : platform,
			url : url,
			note : note,
			module : 'update'
		};
	}
	$.post("versionAction!saveOrUpdate.zk", postData, function(data) {
		if (data.STATUS) {
			if(data.ERROR&&data.ERROR=='No Login!'){
                //alert('登陆超时，请重新登录!');
                //location.replace('index.html');
				var user_id =  localStorage.getItem('user_id');
				var user_pwd = localStorage.getItem('user_pwd');
				if(user_id==''||!user_id||user_pwd==''||!user_pwd){
					$.messager.alert('信息提示', '登录超时,请重新登录!', 'error');
					location.replace('index.html');						
				}
				else{
					$.post('loginAction!login1.zk',{user_id:user_id,user_pwd:user_pwd},function(data){
						
					},'json').complete(function(){
						$.post("versionAction!saveOrUpdate.zk", postData, function(data) {
							
						},'json');
					});
				}
            }else{
				$('#dlg').dialog('close');      
				initPage();
				showTip(msg);
            }
		} else {
			alert(data.INFO);
		}
	}, 'json');
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
         $('#dlg').dialog('open').dialog('setTitle','填写App版本信息');
		//原始版本号
		$("#txt_oa").val(row.a);
		$("#txt_ob").val(row.b);
		$("#txt_oc").val(row.c);
		$("#oplatform").val(row.platform);
		$("#txt_a").val(row.a);
		$("#txt_b").val(row.b);
		$("#txt_c").val(row.c);
		$("#sl_platform").val(row.platform);
		$("#txt_url").val(row.downloadUrl);
		$("#tf_note").val(row.releaseNote);
     }else{
    	 $.messager.alert('错误','请先选择一个版本!','error');
     }
}

//删除版本
function del() {
	var row = $('#dg').datagrid('getSelected');
	if(row){
		if (confirm('确定删除该版本吗?')) {
			$.getJSON("versionAction!delete.zk", {
				a : row.a,
				b : row.b,
				c : row.c,
				platform : row.platform
			}, function(data) {
				if (data.STATUS) {
					if(data.ERROR&&data.ERROR=='No Login!'){
                        alert('登陆超时，请重新登录!');
                        location.replace('index.html');
                    }else{
						initPage();
						showTip("成功删除了一条版本信息!");
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

function newAppVersion(){
	//clear form
	$("#txt_oa").val('');
	$("#txt_ob").val('');
	$("#txt_oc").val('');
	$("#oplatform").val('');
	$("#txt_a").val('');
	$("#txt_b").val('');
	$("#txt_c").val('');
	$("#txt_url").val('');
	$("#tf_note").val('');
    $('#dlg').dialog('open').dialog('setTitle','填写App版本信息');
}