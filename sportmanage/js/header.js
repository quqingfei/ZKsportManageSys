/**
 * 
 */
function showTime() {
	timenow.innerHTML = new Date().toLocaleString() + ' 星期'
			+ '日一二三四五六'.charAt(new Date().getDay());
}
function logout() {
	$.getJSON("loginAction!logout.zk", function(data) {
		if (data.STATUS) {
			window.parent.location.replace("index.jsp");
		}
	});
}

/**
 * 时间对象的格式化
 */
Date.prototype.format = function(format) {
	/*
	 * format="yyyy-MM-dd hh:mm:ss";
	 */
	var o = {
		"M+" : this.getMonth() + 1,
		"d+" : this.getDate(),
		"h+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		"S" : this.getMilliseconds()
	};

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}

	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

$(function() {
	isLogin();
	//showTime();
	//setInterval(showTime, 1000);
	$('#logout').click(function(){
		logout();
	});
});

//获取Cookie
function getCookie(name){
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}

//验证是否登陆
function isLogin() {
	var account = getCookie('account');
	if(!account){
		account = "请登录";
	}
	$("#userName").text(account);
}

//重新登陆
function relogin(){
	setTimeout(function(){
		location.replace('index.jsp?redirect=' + encodeURIComponent(location.href));
	}, 1000);
}

/**
 * 处理服务器响应结果
 * @param data json type
 * @returns {Boolean}
 */
function handleResponse(data){
    if (data.STATUS) {
        return true;
    } else {
    	if( data.ERROR=='No Login!'){
            //alert('登陆超时，请重新登录!');
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
						//$('#dg').datagrid('reload');
					}
				},'json').complete(function(){
					//$('#dg').datagrid('reload');
				});
			}
        }else{
            alert(data.INFO);
        }
    	return false;
    }
	
}

/**
 * 处理服务器响应结果,无返回值
 * @param data json type
 * @returns {Boolean}
 */
function handleResponseData(data){
	if( data.ERROR ){
		if( data.ERROR =='No Login!'){
			//alert('登陆超时，请重新登录!');
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
		}else{
			alert(data.ERROR);
		}
    }
	if(data.STATUS && !data.STATUS){
		if( data.INFO ){
			alert(data.INFO);
		}
	}
}