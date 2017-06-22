function saveRequest(){
	$.post('loginAction!saveRequest.zk',{},function(data){
	},'json');
	setTimeout('saveRequest()', 60000);
}
$(function(){
	saveRequest();
});