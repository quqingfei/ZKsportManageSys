/**
 * 
 */

///////////////===========dialog=============////////////////

function showError(msg){
	$.messager.alert('错误', msg, 'error');
}

function confirmDialog(msg,callback){
	$.messager.confirm('确认',msg,function(r){
		if (r){
			callback();
		}
	});
}

function confirmDialog(msg,success,fail){
	$.messager.confirm('确认',msg,function(r){
		if (r){
			success();
		}else{
			fail();
		}
	});
}

function promptDialog(title ,msg,callback){
	$.messager.prompt(title, msg, function(r){
		callback(r);
		/*if (r){
			alert('Your name is:' + r);
		}*/
	});
}

///////////////========================////////////////
function openDialog(id,title){
	var docHeight = $(document).height();
	$('#'+id).dialog('open').dialog('setTitle',title);
	$(".window-mask").css({ height: docHeight});
}
function closeDialog(id){
	$('#'+id).dialog('close');
}