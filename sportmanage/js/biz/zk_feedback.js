///////////////反馈管理/////////////
//刷新数据
function reload(){
    $('#dg').datagrid('reload');
}
$(function() {
    //加载数据
	$('#dg').datagrid({
        onLoadSuccess : function(data) {
            if (data.total == 0 && data.ERROR == 'No Login!') {
            	var user_id =  localStorage.getItem('user_id');
				var user_pwd = localStorage.getItem('user_pwd');
				if(user_id==''||!user_id||user_pwd==''||!user_pwd){
					$.messager.alert('信息提示', '登录超时,请重新登录!', 'error');
					//relogin();
					setTimeout(function(){
	                    location.replace('index.html');
	                }, 3000);
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
				/*
                $.messager.alert('信息提示', '登录超时,请重新登录!', 'error');
                setTimeout(function(){
                    location.replace('index.html');
                }, 3000);*/
            }
			$('#dg').datagrid('doCellTip', {
                onlyShowInterrupt: true, 
                position: 'bottom',
                cls: { 'background-color': '#FFF' },
                delay: 100
	        });
        },
        onLoadError : function() {
            alert('网络连接超时！');
        }
    });
});
//显示消息提示
function showTip(msg) {
    $.messager.show({
        title : "消息",
        timeout:2000,
        msg : msg
    });
}
//回复
function reply() {
	var row = $('#dg').datagrid('getSelected');
    if (row){
    	 if(row.is_reply == 'n'){
    		 //alert('可以回复');
    		 $("#p_suggetion_contion").text(row.content);
             $("#user_id").val(row.user_id);
             $("#suggestion_id").val(row.id);
    		 $('#dlg').dialog('open').dialog('setTitle','填写回复信息');
    	 }else {
    		 $.messager.alert('错误','已经回复啦!','error');
    	 }
     }else{
    	 $.messager.alert('错误','请先选择反馈内容!','error');
     }
}
//提交答复
function save(){
	var suggestion_id = $("#suggestion_id").val();
	var answer = $("#answer").val();
	if(answer!=''){
		var postData = {suggestion_id:suggestion_id,reply_content:answer};
		$.post("feedbackAction!answer.zk",postData,function(data){
			if(data.STATUS){
				if(data.ERROR&&data.ERROR=='No Login!'){
                    alert('登陆超时，请重新登录!');
                    location.replace('index.html');
                }else{
					$("#dlg").dialog('close');
					reload();//刷新表格
					showTip("回复成功!");
	        		$("#p_suggetion_contion").text('');
	                $("#user_id").val('');
	                $("#suggestion_id").val('');
	                $("#answer").val('');
                }
			}else{
				alert("回复失败!");
			}
		},'json');
	}else{
		alert('回复内容不能为空!');
	}
}
//删除全部反馈
function deleteAll(){
	var ids = new Array();
	var rows = $('#dg').datagrid('getSelections');//获取选中的多行
	var size = rows.length;
	for(var i=0; i<rows.length; i++){
	    ids.push(rows[i].id);
	}
	if(ids.length<1){
		alert("请选择要删除的反馈!");
		return ;
	}
    if (confirm('确定要删除所选反馈吗?')) {
        $.post("feedbackAction!batchDelete.zk", {
            id : ids.join(",")
        }, function(data) {
            if (data.STATUS) {
            	if(data.ERROR&&data.ERROR=='No Login!'){
                    alert('登陆超时，请重新登录!');
                    location.replace('index.html');
                }else{
                	reload();//刷新表格
                	showTip("成功删除"+size+"条反馈!");
                }
            } else {
                alert("删除反馈失败");
            }
        }, 'json');
    }
}
//格式化时间
function formatDate(value){
    var d = new Date(value);   
    return  d.format("yyyy-MM-dd hh:mm:ss");    
}
//重新加载表格数据
function reloadData(word , status){
	$("#isReplyHd").val(status);
	$("#dg").datagrid('load',{keyword:word,isReply:status});
}
//搜索框点击和回车事件
function search(value,name){
	reloadData(value, name);
}
//下拉选框改变事件
function menuHandler(item){
	var word = $("#txt_word").val();
    reloadData(word, item.name);
    linkBtnHandler(item.name);
}
//更新回复buton状态
function linkBtnHandler(s){
	if(s == 'n' || s == 'a'){
		$('#replyLnk').linkbutton('enable');
	}else {
		$('#replyLnk').linkbutton('disable');
	}
}