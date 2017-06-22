
accessid = '';
accesskey = '';
host = '';
policyBase64 = '';
signature = '';
callbackbody = '';
filename = '';
key = '';
expire = 0;
now = timestamp = Date.parse(new Date()) / 1000; 

function send_request()
{
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    if (xmlhttp!=null)
    {
        phpUrl = '../OSSPolicyAction.zk' ;
        //phpUrl = 'policy.json' ;
    	//phpUrl = 'policy_test.json?'+new Date().getTime() ;
        xmlhttp.onreadystatechange = handleStateChange;
        	
        function handleStateChange(){
        	if(xmlhttp.readyState==4){
        		//if(xmlHttp.status==200)
        	}
        }
        xmlhttp.open( "GET", phpUrl, false );
        xmlhttp.send( null );
        //console.log('+++++++++++++++'+xmlhttp.responseText);
        return xmlhttp.responseText;
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
};

function get_signature()
{
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000; 
    console.log('get_signature ...');
    console.log('expire:' + expire.toString());
    console.log('now:', + now.toString());
    if (expire < now + 30 * 60)//30分钟
    {
        console.log('get new sign');
        body = send_request();
        var obj = eval ("(" + body + ")");
        host = obj['host'];
        policyBase64 = obj['policy'];
        accessid = obj['accessid'];
        signature = obj['signature'];
        expire = parseInt(obj['expire']);
        callbackbody = obj['callback'] ;
        key = obj['dir'];
        return true;
    }
    return false;
};

function set_upload_param(up)
{
    var ret = get_signature();
    if (ret == true)
    {
        new_multipart_params = {
            'key' : key + '${filename}',//OSS Object的名字 
            'policy': policyBase64,
            'OSSAccessKeyId': accessid, 
            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
            'callback' : callbackbody,
            'signature': signature,
        };

        up.setOption({
            'url': host,
            'multipart_params': new_multipart_params ,
            /*filters : {
            	  mime_types : [ //只允许上传图片和zip文件
            	    { title : "Image files", extensions : "jpg,gif,png" }, 
            	    { title : "Zip files", extensions : "zip" }
            	  ],
            	  max_file_size : '400kb', //最大只能上传400kb的文件
            	  prevent_duplicates : true //不允许选取重复文件
            	}*/
        });

        console.log('reset uploader');
        //uploader.start();
    }
}

var uploader = new plupload.Uploader({
	runtimes : 'html5,flash,silverlight,html4',
	browse_button : 'uppriew', 
	container: document.getElementById('upcontainer'),
	flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',

    url : 'http://oss.aliyuncs.com',

	init: {
		PostInit: function() {
			//document.getElementById('ossfile').innerHTML = '';
/*			document.getElementById('postfiles').onclick = function() {
	            set_upload_param(uploader);
	            uploader.start();
	            return false;
			};*/
			//alert(1);
		},

		FilesAdded: function(up, files){
			document.getElementById('poststatus').innerHTML = '';
/*			plupload.each(files, function(file) {
				document.getElementById('poststatus').innerHTML = '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
				+'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
				+'</div>';
			});*/
			var length =  uploader.files.length;
			for(var i= 0;i<length-1;i++){
				uploader.stop();
				console.log(uploader.files[i].id);
				uploader.removeFile(uploader.files[i].id);
			}
			var file = files[0];
			//plupload.each(files, function(file) {
				document.getElementById('poststatus').innerHTML = '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
				//+'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
				+'</div>';
			//});
            set_upload_param(uploader);
            uploader.start();
            //return false;
            //console.log('select file...'+files[0]);
            
		},

		UploadProgress: function(up, file) {
			var d = document.getElementById(file.id);
			d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            
            //var prog = d.getElementsByTagName('div')[0];
			//var progBar = prog.getElementsByTagName('div')[0]
			//progBar.style.width= 2*file.percent+'px';
			//progBar.setAttribute('aria-valuenow', file.percent);
		},

		FileUploaded: function(up, file, info){
            console.log('uploaded');
            console.log(info.status);
            set_upload_param(up);
            if (info.status == 200 || info.status == 203)
            {
            	//alert('upload finish');
    			var src = 'http://zkimages.oss-cn-hangzhou.aliyuncs.com/'+key+encodeURI(file.name);
    			console.log('upload complete , src :'+ src);
    			var type = $('#uptype').combobox('getValue');
    			var tpl = '';
    	    	//视频
    	    	if(type == 1){
    	    		var videoId = $.now();
    	    		tpl = '<video id="'+videoId+'" width="320" height="240" controls="controls"><source src="'+src+'" type="video/mp4"></video>';
    	    		$('#uppriew').html(tpl);
    	    		document.getElementById(videoId).addEventListener("canplaythrough", function () {
    	    			//要执行的函数内容
    	    			$('#uptime').textbox('setValue',parseInt(document.getElementById(videoId).duration));//*1000
    	    		});
    	 
    	    	//图片
    	    	}else if(type == 2){
    	    		tpl = '<img src="'+src+'" style="width: 320px;height: 240px;" />';
    	    		$('#uppriew').html(tpl);
    	    	}
    			
    			$('#upfile').val(src);
    			$('#upfilesize').val(file.size);
            }
            else
            {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
            } 
		},
		UploadComplete : function(uploader,files){
			console.log('upload completed ...');
			var file = files[0];
			

			
		},

		Error: function(up, err) {
            set_upload_param(up);
			document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
		}
	}
});

uploader.init();


var upmusics = [];

function delMusic(id){
	$('#upmusicwrap_' + id).remove();
	var tmp = [];
	for(var i = 0 ;i<upmusics.length;i++){
		if(id != upmusics[i].stepId){
			tmp.push(upmusics[i]);
		}
	}
	upmusics = tmp ;
}

var musicuploader = new plupload.Uploader({
	runtimes : 'html5,flash,silverlight,html4',
	browse_button : 'upmusicbtn', 
	container: document.getElementById('upmusiccontainer'),
	flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
	
	url : 'http://oss.aliyuncs.com',
	
	init: {
		PostInit: function() {
		},
		
		FilesAdded: function(up, files) {
			document.getElementById('upmusicstatus').innerHTML = '';
			var file = files[0];
			document.getElementById('upmusicstatus').innerHTML = '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
			+'</div>';
			set_upload_param(musicuploader);
			musicuploader.start();
		},
		
		UploadProgress: function(up, file) {
			var d = document.getElementById(file.id);
			d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
			
			var prog = d.getElementsByTagName('div')[0];
		},
		
		FileUploaded: function(up, file, info) {
			console.log('uploaded');
			console.log(info.status);
			set_upload_param(up);
			if (info.status == 200 || info.status == 203)
			{
				//alert('upload finish');
				var src = 'http://zkimages.oss-cn-hangzhou.aliyuncs.com/'+key+encodeURI(file.name);
				console.log('upload complete , src :'+ src);
				
				var id = $.now();
				
				var music = {
						"file" : src ,
						"fileSize" : file.size ,
						"stepId" : id
				};
				upmusics.push(music);
				
				var tpl = '<div id="upmusicwrap_'+id+'" style="margin: 0 0 10px 0;">'+file.name+'<audio id="upmusic_'+id+'" src="'+src+'" controls="controls"></audio><a class="delMusic" href="javascript:void(0)" onclick="delMusic(\''+id+'\')">删除</a></div>';
				$('#musicPriew').append(tpl);
			}
			else
			{
				document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
			} 
		},
        UploadComplete : function(uploader,files){
            $('#upmusicstatus').empty();//清空上传状态
        }


	}
});

musicuploader.init();
