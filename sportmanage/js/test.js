/**
 * Created by Administrator on 2016/5/5.
 */

$(function(){
    $('#dg').datagrid({
        onLoadSuccess: function(data){
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
            $("a.popImage").fancybox({
                openEffect  : 'elastic',
                closeEffect: 'elastic'
            });
        },
        onLoadError : function() {
            alert('出错啦');
        }
    });
    $('#searchState').combobox({
        onChange: function (n,o) {
            searchUser();
        }
    });

});
//删除比赛
function del(){
    var row = $('#dg').datagrid('getSelected');
    if(!row){
        showError('请先选择比赛!');
        return;
    }
    $.messager.confirm('&nbsp;&nbsp;&nbsp;&nbsp;确认', "确定删除?", function(r) {
        if (r) {
            $.getJSON('FatburnGameAction!delete.zk',{id:row.id},function(data){
                if(data.STATUS){
                    $('#dg').datagrid('reload');
                    showTip("删除成功!");
                }else {
                    showTip("删除失败!");
                }
            });
        }
    });
}
var url;
function newGame(){
    $('#fm').form('clear');
    openDialog('dlg', '请编辑比赛信息');
    var games=[];
    var gameSel;
    $.post('FatburnGameAction!listTemps.zk', {}, function(data) {
        if (data.STATUS) {
            var rows = data.gameTemps;
            alert(rows);
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var game = {
                    "id": i,
                    "code": row.code,
                    "info": row.info,
                    "name": row.name,
                    "type": row.type
                };
                games.push(game);
            }

            $('#code').combobox({
                valueField: 'id',
                textField: 'name',
                data: games,
                onSelect: function(rec) {
                    gameSel = games[rec.id].code;
                    $('#gameInfo').val(games[rec.id].info);
                    var equips = [];
                    for (var i = games[rec.id].type.length - 1; i >= 0; i--) {
                        var equip = games[rec.id].type[i];
                        var name;
                        switch (equip) {
                            case 'bike':
                                name = '健身车';
                                break;
                            case 'stepper':
                                name = '踏步机';
                                break;
                            case 'treadmill':
                                name = '跑步机';
                                break;
                            default:
                                name = '';
                                break;
                        }
                        var type = {
                            'id': equip,
                            'name': name
                        }
                        equips.push(type);
                    }
                    $('#gameEquip').combobox({
                        valueField: 'id',
                        textField: 'name',
                        data: equips,
                        onSelect: function(rec) {
                            gameSel = games[rec.id].code;
                            $('#gameInfo').val(games[rec.id].info);
                            $('#gameEquip').val(games[rec.id].type);

                        }
                    });
                }
            });
        }
    }, 'json');
    url = 'FatburnGameAction!add.zk';
}
//编辑比赛信息
function editGame(){
    var row = $('#dg').datagrid('getSelected');
    if (!row){
        showError('请先选择要编辑的比赛!');
        return;
    }
    gymID = row.id;
    openDialog('dlg', '编辑比赛信息');
    //#("#code").combobox(setValue,row.code);
    //#("#equip").combobox(setValue,row.equip);

    $('#fm').form('load',row);
    url = 'FatburnGameAction!update.zk?id='+row.id;
}
//检查表单
function checkForm(){
    var code =$("#code").combobox("getValue");
    if(code==''){
        $.messager.alert('警告','比赛代号不能为空!');
        $("#code").focus();
        return false;
    }
    var equip =$("#gameEquip").combobox("getValue");
    if(equip==''){
        $.messager.alert('警告','比赛设备不能为空!');
        $("#gameEquip").focus();
        return false;
    }
    var seconds = $("#seconds").textbox("getValue")
    if(seconds==''){
        $.messager.alert('警告','比赛时长不能为空!');
        $("#seconds").focus();
        return false;
    }
    return true;
}

//提示信息
function showTip(msg) {
    $.messager.show({
        title : "消息",
        timeout:2000,
        msg : msg
    });
}
function saveGame() {
    if (checkForm()) {
        $('#fm').form('submit',{
            url:'FatburnGameAction!add.zk',
            onSubmit: function(){
                return checkForm();
            },
            success: function (result) {
                var result = $.parseJSON(result);
                if (result.STATUS) {
                    $('#dlg').dialog('close');
                    $('#dg').datagrid('reload');
                } else {
                    showError(result.INFO);
                }
            }
        });
    }
}
function vet(){
    var row = $('#dg').datagrid('getSelected');
    if(!row){
        showError('先选择比赛');
        return ;
    }
    id=$('#checkGymId').val(row.id);
    $('#checkName').text(row.name ? row.name : '' );
    $('#checkOrganizersName').text(row.organizersName ? row.organizersName :'');
    $('#checkGameSportType').text(row.gameSportType ? row.gameSportType : '');
    $('#checkJoinTotle').text(row.joinTotle ? row.joinTotle : '');
    $('#checkGmtStart').text(row.gmtStart ?formatDate(row.gmtStart) : '');
    $('#checkGmtEnd').text(row.gmtEnd ?formatDate(row.gmtEnd) : '');
    $('#checkInfo').text(row.info ? row.info : '');
    $('#checkGameType').text(row.gameType ? row.gameType : '');
    if(row.isAudited== '2'){
        $('#checkresult').text('审核失败!' );
    }else if(row.isAudited == '1'){
        $('#checkresult').text('已通过审核!');
    }else if(row.isAudited ==  '0'){
        $('#checkresult').text('未审核');
    }
    openDialog('gymCheckdlg','审核比赛活动信息');
}
function saveCheck(s){
    var row = $('#dg').datagrid('getSelected');
    if(s==1){
        $.post('FatburnGameAction!audited.zk',{id:row.id,pass:"y"},function(data){
            if(data.STATUS){
                closeDialog('gymCheckdlg');
                $('#dg').datagrid('reload');
            }else{
                showError(data.INFO);
            }
        },'json');
    }else{
        $.post('FatburnGameAction!audited.zk',{id:row.id,pass:"n"},function(data){
            if(data.STATUS){
                closeDialog('gymCheckdlg');
                $('#dg').datagrid('reload');
            }else{
                showError(data.INFO);
            }
        },'json');
    }

}
function searchUser(){
    var searchKey = $('#searchKey').textbox('getValue');
    var searchState = $('#searchState').combobox('getValue');
    $("#dg").datagrid('load',{name:searchKey,isAudited:searchState});
}
function formatState1(s){
    if(s==0){
        return "未审核";
    }else if(s==1){
        return "已审核";
    }else{
        return "审核失败";
    }

}

