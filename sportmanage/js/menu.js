/**
管理菜单
*/
var zkMenu = {
	
	"menu" : [
	              {"name":"用户管理","url":"main.html","no":1},
	              {"name":"用户健康数据分析","url":"data.html","no":2},
	              {"name":"订单管理","url":"order.html","no":8},
	              {"name":"产品管理","url":"product.html","no":9},
	              {"name":"文章发布","url":"release.html","no":3},
	              {"name":"用户反馈","url":"feedback.html","no":4},
	              {"name":"app版本管理","url":"app.html","no":5},
	              {"name":"社区管理","url":"community.html","no":7},
	              {"name":"安全管理","url":"safety.html","no":6},
	              {"name":"销售分布","url":"userMap.html","no":15},
	              {"name":"视频管理","url":"video.html","no":16},
	              {"name":"勋章管理","url":"medal.html","no":17},
	         ],
	
	"showMenu" : function(no){
		var items = [];
		for(var i = 0 ;i< this.menu.length;i++){
			var m = this.menu[i];
			var style = m.no == no ? ' style="background: #d8d8d8;"' : '';
			var item = "<div class=\"main_pie\" "+style+"> <a href=\"javascript:void(0)\" onclick=\"window.parent.location='"+m.url+"'\">"+m.name+"<em class=\"main_xuan_"+m.no+"\"></em></a></div>";
			items.push(item);
		}
		//$("#zkmenu").html(items.join(''));
		//$('.main_poy').appendAfter(items.join(''));
	}
};