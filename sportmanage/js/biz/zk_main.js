///////////////用户管理/////////////
$(function() {
	$('#dg').datagrid({
		onLoadSuccess: function(data) {
			if (data.total == 0 && data.ERROR == 'No Login!') {
				//relogin();
				var user_id = localStorage.getItem('user_id');
				var user_pwd = localStorage.getItem('user_pwd');
				if (user_id == '' || !user_id || user_pwd == '' || !user_pwd) {
					$.messager.alert('信息提示', '登录超时,请重新登录!', 'error');
					relogin();
				} else {
					$.post('loginAction!login1.zk', {
						user_id: user_id,
						user_pwd: user_pwd
					}, function(data) {
						if (data.STATUS) {
							$('#dg').datagrid('reload');
						}
					}, 'json').complete(function() {
						$('#dg').datagrid('reload');
					});
				}

			}
		},
		onLoadError: function() {
			alert('出错啦');
		}
	});

	$.getJSON("userAction!getUserSummary.zk", function(data) {
		$("#total").text(data.total);
		$("#male").text(data.male);
		$("#female").text(data.female);
		$("#age").text(data.age);
		$("#dayUsers").text(data.dayUsers);
		$("#monthUsers").text(data.monthUsers);
		$("#dayNewUsers").text(data.dayNewUsers);
		$("#monthNewUsers").text(data.monthNewUsers);
	});
});

var userId, week;

function show() {
	var row = $('#dg').datagrid('getSelected');
	if (row) {
		$('#usrdlg').dialog('open').dialog('setTitle', '数据分析');
		userId = row.userId;
		week = 1;
		createHealthChart();
	} else {
		$.messager.alert('错误', '请先选择用户!', 'error');
	}
}

function createHealthChart() {
	$.getJSON("userAction!getUserHealthSummary.zk", {
		user_id: userId,
		week: week
	}, function(data) {
		if (data.ERROR && data.ERROR == 'No Login!') {
			alert('登陆超时，请重新登录!');
			location.replace('index.html');
		} else {
			if (data.dates.length > 0) {
				var myChart = echarts.init(document.getElementById('main'));
				myChart.setOption({
					title: {
						text: '用户运动情况分析',
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['使用时长（分）', '踏步数（步）']
					},
					toolbox: {
						show: true,
						orient: 'vertical',
						y: 'center',
						feature: {
							mark: {
								show: false
							},
							dataView: {
								show: false,
								readOnly: false
							},
							magicType: {
								show: true,
								type: ['line', 'bar']
							},
							restore: {
								show: true
							},
							saveAsImage: {
								show: true
							}
						}
					},
					calculable: true,
					xAxis: [{
						type: 'category',
						//data : ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日' ]
						data: data.dates
					}],
					yAxis: [{
						type: 'value',
						splitArea: {
							show: true
						}
					}],
					series: [{
							name: '使用时长（分）',
							type: 'line',
							data: data.usedTime,
							markPoint: {
								data: [{
									type: 'max',
									name: '最大值'
								}, {
									type: 'min',
									name: '最小值'
								}]
							}
						}, {
							name: '踏步数（步）',
							type: 'line',
							data: data.steps,
							markPoint: {
								data: [{
									type: 'max',
									name: '最大值'
								}, {
									type: 'min',
									name: '最小值'
								}]
							}
						}

					]
				});
			} else {
				$("#main").text('没有数据');
			}
		}
	});
}

function prevWeek() {
	week -= 1;
	createHealthChart();
}

function nextWeek() {
	if (week == 1) {
		alert('无法查看本周以后的数据!');
		return;
	} else {
		week += 1;
		createHealthChart();
	}
}

function searchUser(v) {
	$("#dg").datagrid('load', {
		userName: v
	});
}

//app统计分析
function appSummary() {
	$('#appdlg').dialog('open').dialog('setTitle', '数据分析');
	$.getJSON('userAction!appShare.zk', {}, function(data) {
		var rspData = data.datas;
		var labels = [];
		var datas = [];
		for (var i = 0; i < rspData.length; i++) {
			labels.push(rspData[i].appversion);
			var item = {
				value: rspData[i].number,
				name: rspData[i].appversion
			};
			datas.push(item);
		}
		var myChart = echarts.init(document.getElementById('appChart'));
		myChart.setOption({
			title: {
				text: 'App市场份额',
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				x: 'left',
				data: labels
			},
			toolbox: {
				show: true,
				feature: {
					mark: {
						show: false
					},
					dataView: {
						show: false,
						readOnly: false
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			calculable: true,
			series: [{
				name: '市场份额',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: datas
			}]
		});
	});
}

var ss = [];

function initBroadcast() {
	var rows = $('#dg').datagrid('getSelections');
	if (!rows) {
		alert('请选择用户');
		return false;
	}
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		ss.push(row.userId);
	}
	$('#bcimMsg').val('');
	$('#bcmsgDlg').dialog('open').dialog('setTitle', '系统通知');
}

function broadcast() {
	var $msgInput = $('#bcimMsg');
	var msg = $msgInput.val();
	if (msg == '') {
		alert('消息不能为空!');
		$msgInput.focus();
		return false;
	}
	var msl = "[" + ss.toString() + "]"
	var url = $('#url').val();
	$.post('userAction!broadcast.zk', {
		msg: msg,
		userIds: msl,
		url: url
	}, function(data) {
		if (data.STATUS) {
			$('#bcmsgDlg').dialog('close');
			showTip('成功发送广播！');
		} else {
			alert(data.INFO);
		}
	}, 'json');

}

function formatLike(v) {
	if ('y' == v) {
		return '是';
	}
	return '否';
}

function cardTime(v, row) {
	switch (row.cardType) {
		case 'cycle':
			return formatDate(row.gmtEnd);
		case 'times':
			return row.times + '次';
		default:
			return '';
	}
}

//用户健身房相关信息
function toGymDlg() {
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		alert('先选择用户');
		return;
	}
	var userId = row.userId;
	$('#gymDg').datagrid({
		url: 'userAction!listGyms.zk',
		queryParams: {
			userId: userId
		}
	});
	$('#gymDlg').dialog('open').dialog('setTitle', '相关的健身房');

}

function formatLock(value) {
	switch (value) {
		case 'y':
			return '已锁定';
			break;
		case 'n':
			return '未锁定';
			break;
		default:
			return '无状态';
			break;
	}
}

function toUnlock() {
	var row = $('#dg').datagrid('getSelected');
	if (!row) {
		alert('先选择用户');
		return;
	}
	var userId = row.userId;
	$('#gymDg').datagrid({
		url: 'userAction!unLock.zk',
		queryParams: {
			userId: userId
		}
	});
	$.post('userAction!unLock.zk', {
		userId: userId
	}, function(data) {
		if (data.STATUS) {
			$('#dg').datagrid('reload');
		} else {
			alert(data.INFO);
		}
	}, 'json');
	// $('#gymDlg').dialog('open').dialog('setTitle','相关的健身房');

}
var oneAddInfo = null;
function addScore(){
	var row = $('#dg').datagrid('getSelections');
	console.log(row)
	if(!row){
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请先选择用户！');
		return false;
	}
	if(row.length>1){
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '只能选择一位用户!');
		return false;
	}
	oneAddInfo = row[0];
	$('.yonghu').text(oneAddInfo.userName);
	$('#gymDlgl').dialog('open').dialog('setTitle','用户添加积分');
}
function addTrue(){
	var sorce = $('#scores').val();
	var seg = /^[0-9]*[1-9][0-9]*$/;
	if(!seg.test(sorce)){
		$.messager.alert('&nbsp;&nbsp;&nbsp;&nbsp;提示', '请输入大于0的正整数!');
		return false;
	}
	$.ajax({
		type: 'post',
		url: '../fatburn/manage/ScoreCountAction!addScore.zk',
		data: {userId:oneAddInfo.userId,scoreType:"manage",score:sorce},
		dataType: 'json',
		success: function(res){
			if(res.STATUS){
				$.messager.show({ 
					title:'提示:', 
					msg:'积分添加成功', 
					timeout:3000, 
					showType:'slide'
				}); 
				$('#gymDlgl').dialog('close');
				$('#dg').datagrid('reload');
			}
		}
	})
}