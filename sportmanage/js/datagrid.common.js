/**
 * 涉及到EasyUI ,datagrid通用函数
 * 依赖Jquery,jqueryEasyui
 */
$(function() {
	//表格增加事件处理
	$('#dg').datagrid({
		onLoadSuccess : function(data) {
			if (data.total == 0 && data.ERROR == 'No Login!') {
				$.messager.alert('信息提示', '登录超时,请重新登录!', 'error');
				relogin();
			}
		},
		onLoadError : function() {
			alert('出错啦');
		}
	});
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