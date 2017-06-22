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
		
		//平台切换事件,自动搜索
		$("#tb-platform").combobox({
			onChange: function (n,o) {
				var key = $("#txt_word").searchbox("getValue"); 
				var type = $("#txt_word").searchbox("getName"); 
				search(key,type);
			}
		});
		
	});
	//字段的处理
	function formatReceiverName(value){
		return value;
	}
	function formatAddress(value){
		return value;
	}
	function formatProducts(value){
		return '<a data-product=\''+JSON.stringify(value)+'\'onclick=\'seeProductList(this)\'>查看商品列表</a>';//\''+JSON.stringify(value)+'\'
	}
	function seeProductList(value){
		//alert(JSON.stringify($(value).data('product')));
		value = $(value).data('product');
		//value = eval('('+value+')');
		if(value&&value!=null){
			var orders = value;
			var dataList = [];
			var product;
			for(var j=0;j<orders.length;j++){
				var theOrder = orders[j];
				var types = eval('('+theOrder.goodsType+')');
				var type="";
				for(var k=0;k<types.length;k++){
					if(types[k].id == theOrder.goodsTypeId){
						type = types[k].name;
					}
				}
				var theTotal = (parseFloat(theOrder.price)*parseInt(theOrder.count)).toFixed(2);
				product = {
						 "goodsId": theOrder.goodsId,//产品id
						 "typeId": theOrder.goodsTypeId,
						 "count":theOrder.count,
						 "type":type,
						 "theTotal" :theTotal,
						 "name" : theOrder.goodsName,
						 "image" :theOrder.goodsImages
				};
				if(theOrder.logistics){
					product.logistics = theOrder.logistics;
				}
				if(theOrder.logisticsNumber){
					product.logisticsNumber = theOrder.logisticsNumber;
				}
				dataList.push(product);
				
			}
			$("#dlgProduct").empty();
			$('#dlgProduct').dialog('open').dialog('setTitle','产品列表');
			$.tmpl($("#productTmpl").html(),dataList).appendTo("#dlgProduct");
			//$('#dlgProduct').show();
		}
	}
	
	function formatDate(value){
		var d = new Date(value);   
	    return  d.format("yyyy-MM-dd hh:mm:ss");
	}
	function formatStatus(value){
		switch(parseInt(value)){
			case 0:return '未付款';
			case 1:return '待发货';
			case 2:return '已发货';
			case 3:return '已完成';
			default:return '';
		}
	}
	function formatReturnStatus(value){
		switch(parseInt(value)){
			case 0:return '无售后';
			case 1:return '申请退货';
			case 2:return '正在退款';
			case 3:return '退款成功';
			case 4:return '申请换货';
			case 5:return '正在换货';
			case 6:return '换货成功';
			default:return '';
		}
	}
	function formatTotal(value,row,index){
		value = row.detail;
		if(value&&value!=null){
			var orders = value;
			var dataList = [];
			var allFare=0;
			var allTotal = 0;
			var product;
			for(var j=0;j<orders.length;j++){
				var theOrder = orders[j];
				var types = eval('('+theOrder.goodsType+')');
				var type="";
				for(var k=0;k<types.length;k++){
					if(types[k].id == theOrder.goodsTypeId){
						type = types[k].name;
					}
				}
				var theTotal = (parseFloat(theOrder.price)*parseInt(theOrder.count)).toFixed(2);
				product = {
						 "goodsId": theOrder.goodsId,//产品id
						 "typeId": theOrder.goodsTypeId,
						 "count":theOrder.count,
						 "type":type,
						 "theTotal" :theTotal,
						 "name" : theOrder.goodsName,
						 "image" :theOrder.goodsImages
				};
				allFare += parseFloat(theOrder.freightPrice)*parseInt(theOrder.count);
				allTotal += parseFloat(theTotal);
				dataList.push(product);
				
			}
			allTotal += allFare;
			return allTotal.toFixed(2);
			//$('#dlgProduct').show();
		}
		return '';
	}
	//订单总金额
	function total(detail){
		value = detail;
		if(value&&value!=null){
			var orders = value;
			var dataList = [];
			var allFare=0;
			var allTotal = 0;
			var product;
			for(var j=0;j<orders.length;j++){
				var theOrder = orders[j];
				var types = eval('('+theOrder.goodsType+')');
				var type="";
				for(var k=0;k<types.length;k++){
					if(types[k].id == theOrder.goodsTypeId){
						type = types[k].name;
					}
				}
				var theTotal = (parseFloat(theOrder.price)*parseInt(theOrder.count)).toFixed(2);
				product = {
						 "goodsId": theOrder.goodsId,//产品id
						 "typeId": theOrder.goodsTypeId,
						 "count":theOrder.count,
						 "type":type,
						 "theTotal" :theTotal,
						 "name" : theOrder.goodsName,
						 "image" :theOrder.goodsImages
				};
				allFare += parseFloat(theOrder.freightPrice)*parseInt(theOrder.count);
				allTotal += parseFloat(theTotal);
				dataList.push(product);
				
			}
			allTotal += allFare;
			return allTotal;
			//$('#dlgProduct').show();
		}
		return 0;
	}
	//总运费
	function totalFare(detail){
		value = detail;
		if(value&&value!=null){
			var orders = value;
			var dataList = [];
			var allFare=0;
			var allTotal = 0;
			var product;
			for(var j=0;j<orders.length;j++){
				var theOrder = orders[j];
				var types = eval('('+theOrder.goodsType+')');
				var type="";
				for(var k=0;k<types.length;k++){
					if(types[k].id == theOrder.goodsTypeId){
						type = types[k].name;
					}
				}
				var theTotal = (parseFloat(theOrder.price)*parseInt(theOrder.count)).toFixed(2);
				product = {
						 "goodsId": theOrder.goodsId,//产品id
						 "typeId": theOrder.goodsTypeId,
						 "count":theOrder.count,
						 "type":type,
						 "theTotal" :theTotal,
						 "name" : theOrder.goodsName,
						 "image" :theOrder.goodsImages
				};
				allFare += parseFloat(theOrder.freightPrice)*parseInt(theOrder.count);
				allTotal += parseFloat(theTotal);
				dataList.push(product);
				
			}
			allTotal += allFare;
			return allTotal;
			//$('#dlgProduct').show();
		}
		return 0;
	}
	//修改运费后更新总金额
	function reloadAmount(){
		var total =  parseInt($('#freightPrice').numberbox('getValue'))+ parseInt($('#price').numberbox('getValue'))-curOrderFare;
		$('#price').numberbox('setValue',total);
		curOrderFare = parseInt($('#freightPrice').numberbox('getValue'));
	}
	var url;
	//新增订单
	function newOrder(){
		$('#fm').form('clear');
		url="ShopOrderAction!add.zk";
		$('#dlgOrder').dialog('open').dialog('setTitle','产品列表');
	}
	var curOrderFare;
	//编辑订单
	function updateOrder(){
		var row = $('#dg').datagrid('getSelected');
		if (row){
			$('#fm').form('clear');
			var data = {
				id:row.id,
				userId:row.userId,
				returnReason:row.returnReason,
				status:row.status,
				returnStatus:row.returnStatus,
				receiverName:row.receiverName,
				receiverPhone:row.receiverPhone,
				receiverAddress:row.receiverAddress,
				freightPrice:row.freightPrice,
				price:row.price,//total(row.detail),
				gmtCreate:new Date(row.gmtCreate).format("yyyy-MM-dd hh:mm:ss")
			};
			$('#fm').form('load',data);
			curOrderFare = parseInt(row.freightPrice);
			$('#dlgOrder').dialog('open').dialog('setTitle','更新订单信息');
			url = "ShopOrderAction!update.zk";
		}else{
			$.messager.alert('错误','请选择订单!','error');
		}
	}
	
	//检查数据是否完善合理
	function check(){
		var receiverName = $('#receiverName').textbox('getValue');
		if(!receiverName){
			$('#receiverName').textbox().next('span').find('input').focus();
			alert('收货人姓名不能为空!');
			return false;
		}
		var receiverPhone = $('#receiverPhone').textbox('getValue');
		if(!receiverPhone){
			$('#receiverPhone').textbox().next('span').find('input').focus();
			alert('收货人手机号不能为空!');
			return false;
		}
		var receiverAddress = $('#receiverAddress').textbox('getValue');
		if(!receiverAddress){
			$('#receiverAddress').textbox().next('span').find('input').focus();
			alert('收货人地址不能为空!');
			return false;
		}
		var freightPrice = $('#freightPrice').numberbox('getValue');
		if(!freightPrice){
			$('#freightPrice').numberbox().next('span').find('input').focus();
			alert('运费不能为空!');
			return false;
		}
		var price = $('#price').numberbox('getValue');
		if(!price){
			$('#price').numberbox().next('span').find('input').focus();
			alert('总金额不能为空!');
			return false;
		}
		var gmtCreate = $('#gmtCreate').datetimebox('getValue');
		if(!gmtCreate){
			$('#gmtCreate').datetimebox().next('span').find('input').focus();
			alert('下单日期不能为空!');
			return false;
		}
		return true;
	}
	//保存订单
	function saveOrder(){
		if(check()){
			 $('#fm').form('submit',{
                 url: url,
                 onSubmit: function(){
                     return check();
                 },
                 success: function(result){
                     result = eval('('+result+')');
                     if (result.STATUS){
                         $('#dlgOrder').dialog('close');        // close the dialog
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
	//删除订单
	function del(){
		var row = $('#dg').datagrid('getSelected');
		if (row){
			$.messager.confirm('删除订单', '确定删除该订单吗?', function(r){
	            if (r){
	    			$.post('ShopOrderAction!delete.zk',{id:row.id},function(data){
	    				if(data.STATUS){
	    					$('#dg').datagrid('reload');
	    					$.messager.show({
	    						title : "消息",
	    						timeout:2000,
	    						msg : "删除成功!"
	    					});
	    				}else {
	    					$.messager.alert('错误',data.INFO || data.ERROR,'error');
	    				}
	    			},'json');
	            }
	        });
		}else{
			$.messager.alert('错误','请先选择订单!','error');
		}		
	}
	//发货
	function delivery(){
		var row = $('#dg').datagrid('getSelected');
		if (row){
			if(parseInt(row.status)!=1){
				$.messager.alert('警告','该订单无法发货!','error');
				return;
			}
			$.messager.confirm('发货', '是否确认发货?', function(r){
	            if (r){
	    			$.post('ShopOrderAction!update.zk',{id:row.id,status:2},function(data){
	    				if(data.STATUS){
	    					$('#dg').datagrid('reload');
	    					$.messager.show({
	    						title : "消息",
	    						timeout:2000,
	    						msg : "发货成功!"
	    					});
	    				}else {
	    					$.messager.alert('错误',data.INFO || data.ERROR,'error');
	    				}
	    			},'json');
	            }
	        });
		}else{
			$.messager.alert('错误','请先选择订单!','error');
		}		
	}
	//确认付款
	function payment(){
		var row = $('#dg').datagrid('getSelected');
		if (row){
			if(parseInt(row.status)!=0){
				$.messager.alert('警告','该订单已经付款!','error');
				return;
			}
			$.messager.confirm('发货', '是否确认付款?', function(r){
				if (r){
					$.post('ShopOrderAction!update.zk',{id:row.id,status:1},function(data){
						if(data.STATUS){
							$('#dg').datagrid('reload');
							$.messager.show({
								title : "消息",
								timeout:2000,
								msg : "付款成功!"
							});
						}else {
							$.messager.alert('错误',data.INFO || data.ERROR,'error');
						}
					},'json');
				}
			});
		}else{
			$.messager.alert('错误','请先选择订单!','error');
		}		
		
	}
	//退货
	function refund(){
		var row = $('#dg').datagrid('getSelected');
		if (row){
			if(parseInt(row.returnStatus)==0){
				$.messager.alert('警告','该订单无法退货!','error');
				return;
			}
			$('#fmReturn').form('clear');
			var data = {
				id:row.id,
				userId:row.userId,
				returnReason:((row.returnReason&&row.returnReason!=null&&row.returnReason!=undefined)?row.returnReason:''),
				status:row.status,
				returnStatus:row.returnStatus,
				receiverName:row.receiverName,
				receiverPhone:row.receiverPhone,
				receiverAddress:row.receiverAddress
			};
			$('#fmReturn').form('load',data);
			$('#dlgReason').dialog('open').dialog('setTitle','退货信息');
			url = "ShopOrderAction!update.zk";
		}else{
			$.messager.alert('错误','请选择订单!','error');
		}
	}
	//换货
	function changeGoos(){
		var row = $('#dg').datagrid('getSelected');
		if (row){
			if(parseInt(row.returnStatus)==0){
				$.messager.alert('警告','该订单无法退货!','error');
				return;
			}
			$('#fmReturn').form('clear');
			var data = {
				id:row.id,
				userId:row.userId,
				returnReason:((row.returnReason&&row.returnReason!=null&&row.returnReason!=undefined)?row.returnReason:''),
				status:row.status,
				returnStatus:row.returnStatus,
				receiverName:row.receiverName,
				receiverPhone:row.receiverPhone,
				receiverAddress:row.receiverAddress
			};
			$('#fmReturn').form('load',data);
			$('#dlgReason').dialog('open').dialog('setTitle','换货信息');
			url = "ShopOrderAction!update.zk";
		}else{
			$.messager.alert('错误','请选择订单!','error');
		}
	}
	//保存操作信息
	function saveAction(){
		$('#fmReturn').form('submit',{
            url: url,
            onSubmit: function(){
                return;
            },
            success: function(result){
                result = eval('('+result+')');
                if (result.STATUS){
                    $('#dlgReason').dialog('close');        // close the dialog
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
	//重新加载表格数据
	function reloadData(word,status){
		var data = {};
		var startDate = $("#startDate").datebox("getValue");
		var endDate = $("#endDate").datebox("getValue");
		if(startDate&&startDate!=null)
			data.startDate = startDate;
		if(endDate&&endDate!=null)
			data.endDate = endDate;
		if(word&&word!=null)
			data.key = word;
		if(status&&status!=null){
			if(parseInt(status)!=-1){
				if(parseInt(status)>3)
					data.returnStatus = parseInt(status)-3;
				else
					data.status = parseInt(status);
			}
		}
		$("#dg").datagrid('load',data);
	}
	//搜索框点击和回车事件
	function search(value,name){
		reloadData(value, name);
	}
	
	//下拉选框改变事件
	function menuHandler(item){
		var word = $("#txt_word").val();
		//if()
        reloadData(word, item.name);
    }
	