/**
 * datagrid formtter 
 * author : cj
 * date : 2014-9-12 14:57:11
 * version : 1.0.0
 * 
 */
function formatSex(value) {
	if (value == "M") {
		return "男";
	} else if (value == "F") {
		return "女";
	} else {
		return "未知";
	}
}
function formatDate(value){
    var d = new Date(value);   
    return  d.format("yyyy-MM-dd hh:mm:ss");  
}

function formatURL(value,row){
	if(!value){return '';}
	if(value.indexOf('http')){
		value = 'http://' + value;
	}
	var link = '<a href='+value+' target=\'_blank\'>'+row.platformName+'</a>';
	return link;
}
//////////////////订单相关////////////////
//格式化订单状态
function formatState(s){
	if(s == '1')
		return "未付款";
	else if (s =='2')
		return "已付款";
	else if (s == '3')
		return "正在出库";
	else if (s == '4')
		return "已关闭";
	else if (s == '5')
		return "已退款";
	else if (s == '6')
		return "发货未付款";
	else if (s == '7')
		return "已换货";
}
//格式化订单操作 1- 刚下单,2-已付款,3- 正在出库,4- 交易完成
/*function formatAction(id ,row) {
	var state = row.status ;
	if (state == '2'){
		return "<a href='javascript:void(0)' style='color:#999'  onclick ='delivery(\""
				+ id + "\")' >发货</a>";
		return "";
	} else if(state == '1'){
		return "<a href='javascript:void(0)' style='color:#999'  onclick ='del(\""
		+ id + "\")' >删除</a>";
	} else if(state == '3'){
		return "";
	}  else {
		return "";
	}
}*/
//格式化商品
function formatProduct(s){
	var ps = "";
	var products = $.parseJSON(s);
	for(var i = 0 ;i < products.length ; i++) {
		var product = products[i];
		var name = product.productName;
		var number = product.number;
		var color = product.productDesc;
		var productStr = name + " X "+number + "<br>";
		if(color){
			productStr = name + "-" + color + " X "+number + "<br>";
		}
		ps += productStr ;
	}
	return ps;
}

String.prototype.replaceAll = function(s1,s2){
	return this.replace(new RegExp(s1,"gm"),s2);
};

/**
 * 转义hmtl尖括号
 */
function escapeAngle(s){
	if(s){
		return s.replaceAll("<", "&lt;").replaceAll('>','&gt;');
	}
	return s;
}

//格式化备注
function formatRemark(s){
	return escapeAngle(s);
}

//格式化地址
function formatAddress(s){
	return escapeAngle(s);
}

//格式化收货人
function formatBuyerName(s){
	return escapeAngle(s);
}

//格式化发票
function formatBill(s){
	return escapeAngle(s);
}
//格式化商品,for form
function formatProductForm(s){
	var ps = "";
	if(s.indexOf('[')>=0){
		var products = $.parseJSON(s);
		for(var i = 0 ;i < products.length ; i++) {
			var product = products[i];
			var name = product.productName;
			var number = product.number;
			var color = product.productDesc;
			var productStr = name + "-" + color + " X "+number + "\r\n";
			ps += productStr ;
		}
	}else{
		ps = s ;
	}
	return ps;
}
/////////////////END 订单相关//////////////////

//////////////课程管理///////////////////////////////
function formatCoachs(coachs){
	var cs = $.parseJSON(coachs);
	var s = '';
	for(var i = 0 ;i<cs.length;i++){
		
		if(i < cs.length - 1){
			s+= cs[i] + ',';
		}else{
			s+= cs[i] ;
		}
	}
	return s;
}
/////////////////////////////////////////////


function formatGymState(state){
	switch (state) {
		case 'review': return '待审核';
		case 'normal': return '正常';
		case 'fail': return '未通过';
		default: return '';
	}
}
//会员卡类型
function formatCard(v){
	switch (v) {
		case 'cycle': return '时效';
		case 'times': return '次数';
		default:return '';
	}
}