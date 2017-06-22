/**
 * 社区管理
 */

/**
 * 	替换表情符号
 */
function parseEmoji(str){
	if(!str) return '';
	str = str.replace(/\[\):\]/g,'<img src="images/face/ee_1.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[:D\]/g,'<img src="images/face/ee_2.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[;\)\]/g,'<img src="images/face/ee_3.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[:\-o\]/g,'<img src="images/face/ee_4.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[:p\]/g,'<img src="images/face/ee_5.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(H\)\]/g,'<img src="images/face/ee_6.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[:@\]/g,'<img src="images/face/ee_7.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[:s\]/g,'<img src="images/face/ee_8.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[:\$\]/g,'<img src="images/face/ee_9.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[:\(\]/g,'<img src="images/face/ee_10.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[:'\(\]/g,'<img src="images/face/ee_11.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[:\|\]/g,'<img src="images/face/ee_12.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(a\)]/g,'<img src="images/face/ee_13.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[8o\|]/g,'<img src="images/face/ee_14.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[8\-\|\]/g,'<img src="images/face/ee_15.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\+o\(\]/g,'<img src="images/face/ee_16.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	//str = str.replace(/\[<o\)\]/g,'<img src="images/face/ee_17.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[&lt;o\)\]/g,'<img src="images/face/ee_17.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\|\-\)\]/g,'<img src="images/face/ee_18.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\*\-\)\]/g,'<img src="images/face/ee_19.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[:\-#\]/g,'<img src="images/face/ee_20.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[:\-\*\]/g,'<img src="images/face/ee_21.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\^o\)\]/g,'<img src="images/face/ee_22.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[8\-\)\]/g,'<img src="images/face/ee_23.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(\|\)\]/g,'<img src="images/face/ee_24.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(u\)\]/g,'<img src="images/face/ee_25.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(S\)\]/g,'<img src="images/face/ee_26.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(\*\)\]/g,'<img src="images/face/ee_27.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(#\)\]/g,'<img src="images/face/ee_28.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(R\)\]/g,'<img src="images/face/ee_29.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(\{\)\]/g,'<img src="images/face/ee_30.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(\}\)\]/g,'<img src="images/face/ee_31.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(k\)\]/g,'<img src="images/face/ee_32.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(F\)\]/g,'<img src="images/face/ee_33.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(W\)\]/g,'<img src="images/face/ee_34.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(D\)\]/g,'<img src="images/face/ee_35.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	
	str = str.replace(/\[\(61\]/g,'<img src="images/face/ee_61.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(62\]/g,'<img src="images/face/ee_62.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(63\]/g,'<img src="images/face/ee_63.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(64\]/g,'<img src="images/face/ee_64.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(65\]/g,'<img src="images/face/ee_65.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(66\]/g,'<img src="images/face/ee_66.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(67\]/g,'<img src="images/face/ee_67.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(68\]/g,'<img src="images/face/ee_68.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(69\]/g,'<img src="images/face/ee_69.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(70\]/g,'<img src="images/face/ee_70.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(71\]/g,'<img src="images/face/ee_71.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(72\]/g,'<img src="images/face/ee_72.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(73\]/g,'<img src="images/face/ee_73.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(74\]/g,'<img src="images/face/ee_74.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(75\]/g,'<img src="images/face/ee_75.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(76\]/g,'<img src="images/face/ee_76.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(77\]/g,'<img src="images/face/ee_77.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(78\]/g,'<img src="images/face/ee_78.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(79\]/g,'<img src="images/face/ee_79.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(80\]/g,'<img src="images/face/ee_80.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(81\]/g,'<img src="images/face/ee_81.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(82\]/g,'<img src="images/face/ee_82.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(83\]/g,'<img src="images/face/ee_83.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(84\]/g,'<img src="images/face/ee_84.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(85\]/g,'<img src="images/face/ee_85.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(86\]/g,'<img src="images/face/ee_86.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(87\]/g,'<img src="images/face/ee_87.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(88\]/g,'<img src="images/face/ee_88.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(89\]/g,'<img src="images/face/ee_89.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(90\]/g,'<img src="images/face/ee_90.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(91\]/g,'<img src="images/face/ee_91.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(92\]/g,'<img src="images/face/ee_92.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(93\]/g,'<img src="images/face/ee_93.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(94\]/g,'<img src="images/face/ee_94.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(95\]/g,'<img src="images/face/ee_95.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(96\]/g,'<img src="images/face/ee_96.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(97\]/g,'<img src="images/face/ee_97.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(98\]/g,'<img src="images/face/ee_98.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[\(99\]/g,'<img src="images/face/ee_99.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[100\]/g,'<img src="images/face/ee_100.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[101\]/g,'<img src="images/face/ee_101.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[102\]/g,'<img src="images/face/ee_102.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[103\]/g,'<img src="images/face/ee_103.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[104\]/g,'<img src="images/face/ee_104.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[105\]/g,'<img src="images/face/ee_105.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[106\]/g,'<img src="images/face/ee_106.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[107\]/g,'<img src="images/face/ee_107.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[108\]/g,'<img src="images/face/ee_108.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[109\]/g,'<img src="images/face/ee_109.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[110\]/g,'<img src="images/face/ee_110.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[111\]/g,'<img src="images/face/ee_111.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[112\]/g,'<img src="images/face/ee_112.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[113\]/g,'<img src="images/face/ee_113.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[114\]/g,'<img src="images/face/ee_114.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[115\]/g,'<img src="images/face/ee_115.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[116\]/g,'<img src="images/face/ee_116.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[117\]/g,'<img src="images/face/ee_117.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[118\]/g,'<img src="images/face/ee_118.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[119\]/g,'<img src="images/face/ee_119.png" style="height: 21px;vertical-align: bottom;" border="0" />');
	str = str.replace(/\[120\]/g,'<img src="images/face/ee_120.png" style="height: 21px;vertical-align: bottom;" border="0" />');

	return str;
}

/**
 * 反转义HTML(<>符号)
 */
function unescapeHTML(str){
	if(!str) return '';
	str = str.replace(/</g,'&lt;');
	str = str.replace(/>/g,'&gt;');
	return str;
}

/**
 * 正则替换
 */
function replaceReg(reg,str){ 
	return str.replace(reg,function(m){return '[url='+m+']∞网页链接[/url]';});
}

/**
 * 网页链接转成UBB(网址->UBB)
 */
function escapeLink(s){
	if(!s) return ''; 
	var reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/ig; 
	return replaceReg(reg,s); 
}

/**
 * 反转义链接(ubb->html)
 * @param str
 * @returns
 */
function unescapeLink(str){
	str = str.replace(/\[url=([^\]]+)\]([^\[]+)\[\/url\]/ig, '<a href="$1">'+'$2'+'</a>');
	str = str.replace(/\[url\]([^\[]+)\[\/url\]/ig, '<a href="$1">'+'$1'+'</a>');
	return str;
}

/**
 * 解析（回）帖子内容,表情、链接、XSS
 */
function parseNoteContent(s){
	
	s = unescapeHTML(s);
	s = unescapeLink(s);
	s = parseEmoji(s);
	//var noteContent = ubb2html(note.noteContent);
    //noteContent = noteContent.replace(/∞网页链接/g,"网页链接");
    
    //var noteContent = unescapeHTML(note.noteContent);
    //note.noteContent = parseEmoji(noteContent);
	return s;
}
