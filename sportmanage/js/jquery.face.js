function setFaceLab(index){
	switch (index) {
	case 1: return "[):]";
	case 2: return "[:D]";
	case 3: return "[;)]";
	case 4: return "[:-o]";
	case 5: return "[:p]";
	case 6: return "[(H)]";
	case 7: return "[:@]";
	case 8: return "[:s]";
	case 9: return "[:$]";
	case 10: return "[:(]";
	case 11: return "[:\\'(]";
	case 12: return "[:|]";
	case 13: return "[(a)]";
	case 14: return "[8o|]";
	case 15: return "[8-|]";
	case 16: return "[+o(]";
	case 17: return "[<o)]";
	case 18: return "[|-)]";
	case 19: return "[*-)]";
	case 20: return "[:-#]";
	case 21: return "[:-*]";
	case 22: return "[^o)]";
	case 23: return "[8-)]";
	case 24: return "[(|)]";
	case 25: return "[(u)]";
	case 26: return "[(S)]";
	case 27: return "[(*)]";
	case 28: return "[(#)]";
	case 29: return "[(R)]";
	case 30: return "[({)]";
	case 31: return "[(})]";
	case 32: return "[(k)]";
	case 33: return "[(F)]";
	case 34: return "[(W)]";
	case 35: return "[(D)]";
	
	case 61: return "[(61]";
	case 62: return "[(62]";
	case 63: return "[(63]";
	case 64: return "[(64]";
	case 65: return "[(65]";
	case 66: return "[(66]";
	case 67: return "[(67]";
	case 68: return "[(68]";
	case 69: return "[(69]";
	case 70: return "[(70]";
	case 71: return "[(71]";
	case 72: return "[(72]";
	case 73: return "[(73]";
	case 74: return "[(74]";
	case 75: return "[(75]";
	case 76: return "[(76]";
	case 77: return "[(77]";
	case 78: return "[(78]";
	case 79: return "[(79]";
	case 80: return "[(80]";
	case 81: return "[(81]";
	case 82: return "[(82]";
	case 83: return "[(83]";
	case 84: return "[(84]";
	case 85: return "[(85]";
	case 86: return "[(86]";
	case 87: return "[(87]";
	case 88: return "[(88]";
	case 89: return "[(89]";
	case 90: return "[(90]";
	case 91: return "[(91]";
	case 92: return "[(92]";
	case 93: return "[(93]";
	case 94: return "[(94]";
	case 95: return "[(95]";
	case 96: return "[(96]";
	case 97: return "[(97]";
	case 98: return "[(98]";
	case 99: return "[(99]";
	case 100: return "[100]";
	case 101: return "[101]";
	case 102: return "[102]";
	case 103: return "[103]";
	case 104: return "[104]";
	case 105: return "[105]";
	case 106: return "[106]";
	case 107: return "[107]";
	case 108: return "[108]";
	case 109: return "[109]";
	case 110: return "[110]";
	case 111: return "[111]";
	case 112: return "[112]";
	case 113: return "[113]";
	case 114: return "[114]";
	case 115: return "[115]";
	case 116: return "[116]";
	case 117: return "[117]";
	case 118: return "[118]";
	case 119: return "[119]";
	case 120: return "[120]";

	
	default: return "";
	}
}

// 表情插件
(function($){  
	$.fn.qqFace = function(options){
		var defaults = {
			id : 'facebox',
			path : 'face/',
			assign : 'content',
			tip : '表情'
		};
		var option = $.extend(defaults, options);
		var assign = $('#'+option.assign);
		var id = option.id;
		var path = option.path;
		var tip = option.tip;
		
		if(assign.length<=0){
			alert('缺少表情赋值对象。');
			return false;
		}
		
		$(this).click(function(e){
			var strFace, labFace;
			if($('#'+id).length<=0){
				strFace = '<div id="'+id+'" style="position:absolute;display:none;z-index:1000;" class="qqFace">' +
							  '<table border="0" cellspacing="0" cellpadding="0"><tr>';
				for(var i=1; i<= 35; i++){
					//labFace = '[/'+tip+i+']';
					labFace = setFaceLab(i);
					strFace += '<td><img style="width:24px;" src="'+path+'ee_'+i+'.png" onclick="$(\'#'+option.assign+'\').setCaret();$(\'#'+option.assign+'\').insertAtCaret(\'' + labFace + '\');" /></td>';
					if( i % 15 == 0 ) strFace += '</tr><tr>';
				}
				
				//strFace += '</tr><tr>';
				
/*				for(var i=61; i<=70; i++){
					//labFace = '[/'+tip+i+']';
					labFace = setFaceLab(i);
					strFace += '<td><img style="width:24px;" src="'+path+'ee_'+i+'.png" onclick="$(\'#'+option.assign+'\').setCaret();$(\'#'+option.assign+'\').insertAtCaret(\'' + labFace + '\');" /></td>';
					if( i % 15 == 0 ) strFace += '</tr><tr>';
				}
				strFace += '</tr><tr>';*/
				for(var i=61; i<=120; i++){
					//labFace = '[/'+tip+i+']';
					labFace = setFaceLab(i);
					strFace += '<td><img style="width:24px;" src="'+path+'ee_'+i+'.png" onclick="$(\'#'+option.assign+'\').setCaret();$(\'#'+option.assign+'\').insertAtCaret(\'' + labFace + '\');" /></td>';
					if( (i-10) % 15 == 0 ) strFace += '</tr><tr>';
				}
				strFace += '</tr></table></div>';
			}
			//$('body').append(strFace);
			$(this).append(strFace);
			var offset = $(this).position();
			var top = offset.top + $(this).outerHeight();
			$('#'+id).css('top',top);
			$('#'+id).css('left',offset.left);
			$('#'+id).show();
			e.stopPropagation();
		});

		$(document).click(function(){
			$('#'+id).hide();
			$('#'+id).remove();
		});
	};

})(jQuery);

jQuery.extend({ 
unselectContents: function(){ 
	if(window.getSelection) 
		window.getSelection().removeAllRanges(); 
	else if(document.selection) 
		document.selection.empty(); 
	} 
}); 
jQuery.fn.extend({ 
	selectContents: function(){ 
		$(this).each(function(i){ 
			var node = this; 
			var selection, range, doc, win; 
			if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined'){ 
				range = doc.createRange(); 
				range.selectNode(node); 
				if(i == 0){ 
					selection.removeAllRanges(); 
				} 
				selection.addRange(range); 
			} else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())){ 
				range.moveToElementText(node); 
				range.select(); 
			} 
		}); 
	}, 

	setCaret: function(){ 
		//if(!$.browser.msie) return; 
		var initSetCaret = function(){ 
			var textObj = $(this).get(0); 
			textObj.caretPos = document.selection.createRange().duplicate(); 
		}; 
		$(this).click(initSetCaret).select(initSetCaret).keyup(initSetCaret); 
	}, 

	insertAtCaret: function(textFeildValue){ 
		var textObj = $(this).get(0); 
		if(document.all && textObj.createTextRange && textObj.caretPos){ 
			var caretPos=textObj.caretPos; 
			caretPos.text = caretPos.text.charAt(caretPos.text.length-1) == '' ? 
			textFeildValue+'' : textFeildValue; 
		} else if(textObj.setSelectionRange){ 
			var rangeStart=textObj.selectionStart; 
			var rangeEnd=textObj.selectionEnd; 
			var tempStr1=textObj.value.substring(0,rangeStart); 
			var tempStr2=textObj.value.substring(rangeEnd); 
			textObj.value=tempStr1+textFeildValue+tempStr2; 
			textObj.focus(); 
			var len=textFeildValue.length; 
			textObj.setSelectionRange(rangeStart+len,rangeStart+len); 
			textObj.blur(); 
		}else{ 
			textObj.value+=textFeildValue; 
		} 
	} 
});