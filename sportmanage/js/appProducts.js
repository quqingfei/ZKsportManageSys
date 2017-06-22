	$(function() {
		//表格增加事件处理
		$('#dg').datagrid({
			onLoadSuccess : function(data) {
				if (data.total == 0 && data.ERROR == 'No Login!') {
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
				
 				$('#dg').datagrid('doCellTip', {
	                onlyShowInterrupt: false,     //是否只有在文字被截断时才显示tip，默认值为false             
	                position: 'bottom',   //tip的位置，可以为top,botom,right,left
	                cls: { 'background-color': '#FFF' },  //tip的样式D1EEEE
	                delay: 100   //tip 响应时间
		        });
 				
			},
			onLoadError : function() {
				alert('出错啦');
			},
			onHeaderContextMenu: function(e, field){
				e.preventDefault();
				if (!cmenu){
					createColumnMenu();
				}
				cmenu.menu('show', {
					left:e.pageX,
					top:e.pageY
				});
			}
		});
		//图片弹出层
		 $("a.popImage").fancybox({
	            openEffect  : 'elastic',
	            closeEffect: 'elastic'    
	     });
	});
	function formatImg(value){
		var result = "<a class=\"popImage\" href=\"../file/FileCenter!showImage2.zk?name="+value+"\">点击查看</a>";
	    return result;
	}
	function formatType(value,row){
		return '<a onclick=\'seeProductType("'+row.id+'")\'>查看商品列表</a>';
	}
	function formatStatus(value){
		switch(parseInt(value)){
		case 0:return '未开售';
		case 1:return '销售中';
		case 2:return '售罄';
		default:return '';
		}
	}
	function seeProductType(id){
		 curId = id;
		 productType(id);
    	 $('#dlgType').dialog('open').dialog('setTitle','商品类别');
	}
	function formatSpecialFreight(value,row){
		return '<a onclick=\'seeSpecialFreight("'+row.id+'")\'>查看特殊运费</a>';
	}
	function seeSpecialFreight(id){
		curId = id;
		special(id);
    	$('#dlgSpecial').dialog('open').dialog('setTitle','特殊运费');
	}
	function formatDate(value){
		var d = new Date(value);   
	    return  d.format("yyyy-MM-dd hh:mm:ss");
	}
	var url;
	//新增商品
	function add(){
		$('#fm').form('clear');
		$("#images").val();
		url= "ShopGoodsAction!add.zk";
		 $.post('ShopCategoryAction!list.zk',{parentId:'0',page:1,rows:100},function(data){
  			if(data.STATUS){
  				var list = [];
  				for(var i=0;i<data.rows.length;i++){
  					list.push({id:data.rows[i].id,text:data.rows[i].name});
  				}
  				$('#categoryId').combobox('loadData',list);
  			}
  		},'json');
		$('#dlgProduct').dialog('open').dialog('setTitle','商品新增');
		$("#imghead").attr("src", 'images/yun.png');
	}
	//编辑商品
	function update(){
		 var row = $('#dg').datagrid('getSelected');
         if (row){
        	 $("#images").val();
        	 $('#fm').form('clear');
    		 $.post('ShopCategoryAction!list.zk',{parentId:'0',page:1,rows:100},function(data){
    	  			if(data.STATUS){
    	  				var list = [];
    	  				for(var i=0;i<data.rows.length;i++){
    	  					list.push({id:data.rows[i].id,text:data.rows[i].name});
    	  				}
    	  				$('#categoryId').combobox('loadData',list);
    	  			}
    	  	},'json');
             $('#dlgProduct').dialog('open').dialog('setTitle','编辑商品信息');
             $('#fm').form('load',row);
             $('#categoryId').combobox('setValue',row.categoryId);
             url = 'ShopGoodsAction!update.zk?id='+row.id;
             var imgURL = "../file/FileCenter!showImage2.zk?name=" + row.images;
             $('#images').val(row.images);
             $("#imghead").attr("src", imgURL);
         }else{
        	 $.messager.alert('警告','请先选择要编辑的商品!');
         }
	}
	//删除商品
	function del(){
		var row = $('#dg').datagrid('getSelected');
		if(row){
			if(confirm("确定删除该商品信息?")){
				$.getJSON('ShopGoodsAction!delete.zk',{id:row.id},function(data){
					if(data.STATUS){
						$('#dg').datagrid('reload');
						$.messager.show({
    						title : "消息",
    						timeout:2000,
    						msg : "删除成功!"
    					});
					}else {
						$.messager.show({
    						title : "消息",
    						timeout:2000,
    						msg : "删除失败!"
    					});
					}
				});
			}
		}else{
       	 	$.messager.alert('警告','请先选择商品!');
        }
	}
	//种类
	function openCategory(){
		$('#dlgCategory').dialog('open').dialog('setTitle','商品种类');
	}
	//新增种类
	function toAdd(){
		$('#fmCategory').form('clear');
		url= "ShopCategoryAction!add.zk";
		$.post('ShopCategoryAction!list.zk',{parentId:'0',page:1,rows:30},function(data){
			if(data.STATUS){
				var list = [];
				list.push({id:'0',text:'/'});
				for(var i=0;i<data.rows.length;i++){
					list.push({id:data.rows[i].id,text:data.rows[i].name});
				}
				$('#parentId').combotree('loadData',list);
			}
		},'json');
		//$('#parentId').combotree({url:'ShopCategoryAction!list.zk'});
		$('#categoryAction').dialog('open').dialog('setTitle','新增商品种类');
	}
	//编辑商品
	function toUpdate(){
		 var row = $('#dt').datagrid('getSelected');
         if (row){
        	 $.post('ShopCategoryAction!list.zk',{parentId:'0',page:1,rows:30},function(data){
     			if(data.STATUS){
     				var list = [];
     				list.push({id:'0',text:'/'});
     				for(var i=0;i<data.rows.length;i++){
     					list.push({id:data.rows[i].id,text:data.rows[i].name});
     				}
     				$('#parentId').combotree('loadData',list);
     			}
     		},'json');
            $('#categoryAction').dialog('open').dialog('setTitle','编辑商品种类');
            //$('#parentId').combotree('setValue', '0');
            //$('#categoryId').val(row.id);
            $('#fmCategory').form('load',row);
            url = 'ShopCategoryAction!update.zk?id='+row.id;
         }else{
        	 $.messager.alert('警告','请先选择要编辑的商品种类!');
         }
	}
	//删除商品
	function toDel(){
		var row = $('#dt').treegrid('getSelected');
		if(row){
			if(confirm("确定删除该商品种类?")){
				$.get('ShopCategoryAction!delete.zk',{id:row.id},function(data){
					if(data.STATUS){
						$('#dt').treegrid('reload');
						$.messager.show({
    						title : "消息",
    						timeout:2000,
    						msg : "删除成功!"
    					});
					}else {
						$.messager.show({
    						title : "消息",
    						timeout:2000,
    						msg : "删除失败!"
    					});
					}
				},'json');
			}
		}else{
       	 	$.messager.alert('警告','请先选择商品种类!');
        }
	}
	function saveCategory(){
		$('#fmCategory').form('submit',{
            url: url,
            onSubmit: function(){
                return ;
            },
            success: function(result){
                result = eval('('+result+')');
                if (result.STATUS){
                    $('#categoryAction').dialog('close');        // close the dialog
                    $('#dt').treegrid('reload',{parentId:'0'});    // reload the user data
                } else {
                    $.messager.show({
                        title: '错误',
                        msg: '系统繁忙！'
                    });
                }
            }
        });
	}
	//商品型号
	var curId;
	function openType(){
		 var row = $('#dg').datagrid('getSelected');
         if (row){
        	 curId = row.id;
        	 productType(curId);
        	 $('#dlgType').dialog('open').dialog('setTitle','商品类别');
        	 
         }else{
        	 $.messager.alert('警告','请先选择要编辑的商品型号!');
         }
	}
	function productType(id){
		$.post('ShopGoodsAction!getById.zk',{id:id},function(data){
			if(data.STATUS){
				var type = eval('('+data.shopGoods.type+')');
				$('#dp').datagrid('loadData',type);
			}
		},'json');
	}
	//新增商品类别
	function addType(){
        $("#imagesType").val();
        $("#imagesDetail").val();
		$('#fmType').form('clear');
		url= "ShopGoodsAction!addType.zk";
		$('#typeAction').dialog('open').dialog('setTitle','新增商品型号');
		$("#imgheadType").attr("src", 'images/yun.png');
		$("#imgheadDetail").attr("src", 'images/yun.png');
	}
	//编辑商品leibie
	function updateType(){
		 var row = $('#dp').datagrid('getSelected');
         if (row){
             $("#imagesType").val();
             $("#imagesDetail").val();
        	 $('#fmType').form('clear');
             $('#typeAction').dialog('open').dialog('setTitle','编辑商品型号');
             $('#fmType').form('load',row);
             url = 'ShopGoodsAction!updateType.zk?typeId='+row.id;
             var imgURL = "../file/FileCenter!showImage2.zk?name=" + row.images;
             $("#imgheadType").attr("src", imgURL);
             $('#imagesType').val(row.images);
             var imgDetail = "../file/FileCenter!showImage2.zk?name=" + row.detail;
             $('#imagesDetail').val(row.detail);
             $("#imgheadDetail").attr("src", imgDetail);
         }else{
        	 $.messager.alert('警告','请先选择要编辑的商品型号!');
         }
	}
	//删除商品
	function delType(){
		var row = $('#dp').datagrid('getSelected');
		if(row){
			if(confirm("确定删除该商品型号?")){
				$.getJSON('ShopGoodsAction!deleteType.zk',{id:curId,typeId:row.id},function(data){
					if(data.STATUS){
						//$('#dp').datagrid('reload');
						productType(curId);
						$.messager.show({
    						title : "消息",
    						timeout:2000,
    						msg : "删除成功!"
    					});
					}else {
						$.messager.show({
    						title : "消息",
    						timeout:2000,
    						msg : "删除失败!"
    					});
					}
				});
			}
		}else{
       	 	$.messager.alert('警告','请先选择商品型号!');
        }
	}
	//保存商品型号
	function saveType(){
		$('#productId').val(curId);
		$('#fmType').form('submit',{
            url: url,
            onSubmit: function(){
                return ;
            },
            success: function(result){
                result = eval('('+result+')');
                if (result.STATUS){
                    $('#typeAction').dialog('close');// close the dialog
                    productType(curId);
                } else {
                    $.messager.show({
                        title: '错误',
                        msg: '系统繁忙！'
                    });
                }
            }
        });
	}
	
	//特殊地方的运费
	function formatSpecialType(value){
		switch(parseInt(value)){
		case 0:return '省';
		case 1:return '市';
		case 2:return '县';
		default:return '';
		}
	}
	function openSpecialFreight(){
		var row = $('#dg').datagrid('getSelected');
        if (row){
        	curId = row.id;
       		special(curId);
       		$('#dlgSpecial').dialog('open').dialog('setTitle','特殊运费');
       	 
        }else{
       	 $.messager.alert('警告','请先选择要编辑的商品!');
        }
	}
	
	function special(id){
		$.post('ShopGoodsAction!getById.zk',{id:id},function(data){
			if(data.STATUS){
				var specialFreight = eval('('+data.shopGoods.specialFreight+')');
				$('#ds').datagrid('loadData',specialFreight);
			}
		},'json');
	}
	//新增商品类别
	function addSpecial(){
		$('#fmSpecial').form('clear');
		url= "ShopGoodsAction!setSpecialFreight.zk";
		$('#specialAction').dialog('open').dialog('setTitle','新增特殊运费');
	}
	//编辑商品leibie
	function updateSpecial(){
		 var row = $('#ds').datagrid('getSelected');
         if (row){
        	 $('#fmSpecial').form('clear');
             $('#specialAction').dialog('open').dialog('setTitle','编辑特殊运费');
             $('#fmSpecial').form('load',row);
             url= "ShopGoodsAction!setSpecialFreight.zk";
         }else{
        	 $.messager.alert('警告','请先选择要编辑的特殊运费!');
         }
	}
	//删除商品
	function delSpecial(){
		var row = $('#ds').datagrid('getSelected');
		if(row){
			if(confirm("确定删除该特殊运费?")){
				$.post('ShopGoodsAction!setSpecialFreight.zk',{id:curId,name:row.name,freight:-1,type:row.type},function(data){
					if(data.STATUS){
						//$('#dp').datagrid('reload');
						special(curId);
						$.messager.show({
    						title : "消息",
    						timeout:2000,
    						msg : "删除成功!"
    					});
					}else {
						$.messager.show({
    						title : "消息",
    						timeout:2000,
    						msg : "删除失败!"
    					});
					}
				},'json');
			}
		}else{
       	 	$.messager.alert('警告','请先选择商品类别!');
        }
	}
	//保存商品类别
	function saveSpecial(){
		$('#specialId').val(curId);
		$('#fmSpecial').form('submit',{
           url: url,
           onSubmit: function(){
               return ;
           },
           success: function(result){
               result = eval('('+result+')');
               if (result.STATUS){
                   $('#specialAction').dialog('close');// close the dialog
                   special(curId);
               } else {
                   $.messager.show({
                       title: '错误',
                       msg: '系统繁忙！'
                   });
               }
           }
       });
	}
	
	
	
	
	
	var curImg;
	//选择上传图片
	function chooseImage(id) {
		curImg = 'product';
        document.getElementById(id).click();
    }
	function chooseImageType(id) {
		curImg = 'type';
        document.getElementById(id).click();
   }
	function chooseImageDetail(id) {
		curImg = 'detail';
        document.getElementById(id).click();
   }
	 //上传图片
    function uploadImage(){
    	//alert('upload');
        var viewFiles = document.getElementById("file_title_img");
        //是否为图片类型            
        if(/image\/\w+/.test(viewFiles.files[0].type)){
            //最大图片文件大小 500KB
            var imgSizeLimit = 500 * 1024*1000;
            if(viewFiles.files[0].size<=imgSizeLimit){
                //上传图片
                 $("#title_img_form").ajaxSubmit({
                     type : 'post',
                     url : '../file/FileCenter!uploadImage2.zk',
                     success : function(data) {
                         data = $.parseJSON(data);
                         if (data.name) {
                            // alert(data.name);
                         	var imgURL = "../file/FileCenter!showImage2.zk?name=" + data.name;
                         	if(curImg=='product'){
                         		$("#imghead").attr("src", imgURL);
                         		$("#images").val(data.name);
                         	}
                         	if(curImg=='type'){
                         		$("#imgheadType").attr("src", imgURL);
                         		$("#imagesType").val(data.name);
                         	}
                         	if(curImg=='detail'){
                         		$("#imgheadDetail").attr("src", imgURL);
                         		$("#imagesDetail").val(data.name);
                         	}
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
    
    
  //检查数据是否完善合理
	function check(){
		var name = $('#name').textbox('getValue');
		if(!name){
			$('#name').textbox().next('span').find('input').focus();
			alert('商品名称不能为空!');
			return false;
		}
		var price = $('#price').numberbox('getValue');
		if(!price){
			$('#price').numberbox().next('span').find('input').focus();
			alert('商品价格不能为空!');
			return false;
		}
		var freight = $('#freight').numberbox('getValue');
		if(!freight){
			$('#freight').numberbox().next('span').find('input').focus();
			alert('运费不能为空!');
			return false;
		}
		var images = $('#images').val();
		if(!images){
			$('#images').focus();
			alert('商品show不能为空!');
			return false;
		}
		return true;
	}
  //保存商品信息
	function saveProduct(){
		if(check()){
			$('#categoryIdHide').val($('#categoryId').combobox('getValue'));
			 $('#fm').form('submit',{
                url: url,
                onSubmit: function(){
                    return check();
                },
                success: function(result){
                    result = eval('('+result+')');
                    if (result.STATUS){
                        $('#dlgProduct').dialog('close');        // close the dialog
                        $('#dg').datagrid('reload');    // reload the user data
                    } else {
                        $.messager.show({
                            title: '错误',
                            msg: '系统繁忙！'
                        });
                    }
                }
            });
		}
	}
	function openSorceMallBox() {
		$('#dlgSpecial').dialog('open').dialog('setTitle','积分商城');
	}
	function sorceMall(){
		
	}
	
	$("#Provinces").change(function(){
		$("#Citys").empty();
		$("#Citys").append("<option value='0'>城市/地区/自治州</option>");
		$("#Countys").empty();
		$("#Countys").append("<option value='0'>区/县</option>");
		var id = $(this).val();
		if(id == 0){
			return;
		}
		var province = $("#Provinces").find("option:selected").text();
		$($('#address').children('input')[0]).val('');
		var addressHead = province;
		$($('#address').children('input')[0]).val(addressHead);
		
		$.getJSON('../RegionAction!get.zk',{"id":id},function(data){
			var regions = data.regions ;
			var options = '';
			for(var i = 0 ;i<regions.length ; i++){
				var region = regions[i];
				var option = "<option zipcode='0' value='"+region.regionId+"'>"+region.regionName+"</option>";
				options += option;
			}
			if(options != ''){
				$("#Citys").append(options);
			}
		});
	});
	
	$("#Citys").change(function(){
		$("#Countys").empty();
		$("#Countys").append("<option value='0'>区/县</option>");
		var id = $(this).val();
		
		var province = $("#Provinces").find("option:selected").text();
		var city = $("#Citys").find("option:selected").text();
		$($('#address').children('input')[0]).val('');
		var addressHead = '';
		if(province == '北京市' || province == '天津市' || province == '上海市' || province == '重庆市' ){
			province = '';
			addressHead = city;
		}else{
			addressHead = province +" "+ city;
		}
		$($('#address').children('input')[0]).val(addressHead);
		
		$.getJSON('../RegionAction!get.zk',{"id":id},function(data){
			var regions = data.regions ;
			var options = '';
			for(var i = 0 ;i<regions.length ; i++){
				var region = regions[i];
				var option = "<option zipcode='"+region.zipcode+"' value='"+region.regionId+"'>"+region.regionName+"</option>";
				options += option;
			}
			if(options != ''){
				$("#Countys").append(options);
			}
		});
	});
	
	$("#Countys").change(function(){
		var province = $("#Provinces").find("option:selected").text();
		var city = $("#Citys").find("option:selected").text();
		var county = $("#Countys").find("option:selected").text();
		$($('#address').children('input')[0]).val('');
		var addressHead = '';
		if(province == '北京市' || province == '天津市' || province == '上海市' || province == '重庆市' ){
			province = '';
			addressHead = city+" "+ county;
		}else{
			addressHead = province +" "+ city + " " +county;
		}
		$($('#address').children('input')[0]).val(addressHead);
	});