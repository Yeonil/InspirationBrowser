/*
	Inspiration Browser

	http://inspirationbrowser.com
	https://github.com/Yeonil/InspirationBrowser
	
	제작 및 배포: 훠닐(http://hornil.com)
*/
;(function(lang){
	"use strict"
	
	function createCookie(name, value, days) {
		var expires;
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		} else {
			expires = "";
		}
		document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
	}

	function readCookie(name) {
		var nameEQ = escape(name) + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
		}
		return null;
	}

	function eraseCookie(name) {
		createCookie(name, "", -1);
	}
	
	// 기본 언어 코드
	var defaultLanguageCode = "en";

	lang.getString = getString;

	// 지원하는 언어 목록
	var datas = [
		{ id: "en", url: "js/ib_en.js "},	
		{ id: "kr", url: "js/ib_kr.js "},
	];

	function getDataUrl(langCode){
		for(var iLang = 0; iLang < datas.length; iLang++){
			if(datas[iLang].id == langCode){
				return datas[iLang].url;
			}
		}
		return null;
	}

	function isAvailableLangCode(langCode){
		return getDataUrl(langCode) != null;
	}

	function getString(id){
		try{
			if(ib_lang_data){
				for(var iItem = 0; iItem < window.ib_lang_data.data.length; iItem++){
					if(ib_lang_data.data[iItem].id == id)
						return ib_lang_data.data[iItem].text;
				}
			}else{
				return "";
			}
		}catch(e){
		
		}
		return "";
	}

	lang.writeString = function(id){
		// 스크립트의 실행 순서에 따라 getString을 못할 수 있기에 나중에 재처리를 위해 클래스와 id 값을 저장해 놓는다.
		document.write("<span class='translate' lang_id='"+id+"'>" + getString(id) + "</span>");
	}
	
	function loadData(langCode){
		var dataUrl = getDataUrl(langCode);
		if(dataUrl){
			// 언어가 들어있는 자바스크립트 코드를 동적으로 로딩한다.
			var s = document.createElement('script');
			s.charset = 'UTF-8';
			s.onload = s.onreadystatechange = function() {
				if ((!this.readyState || this.readyState == 'complete')){
					$('.translate').each( function(){
						$(this).text( getString( $(this).attr('lang_id') ));
					})
				}
			}
			s.src = dataUrl;
			var s0 = document.getElementsByTagName('script')[0]; 
			s0.parentNode.appendChild(s);
		}else{

		}
	}

	function loadSettings(){
		
		var langCode = null;

		// url에 새로운 설정이 있는지 살핀다.
		if(location.href.indexOf("?lang=") != -1){
			// 새로운 설정이 있다.
			if(location.href.indexOf("&", location.href.indexOf("?lang=")) != -1){
				// 다른 파라미터가 있는 경우
				var index = location.href.indexOf("?lang=") + 6;
				var length = location.href.indexOf("&", location.href.indexOf("?lang=") + 6 ) - index;
				langCode = location.href.substr(index, length);

			}else{
				// 파라미터가 없는 경우
				var index = location.href.indexOf("?lang=") + 6;
				var length = location.href.length - index;
				langCode = location.href.substr(index, length);
			}
		}
		if(location.href.indexOf("&lang=") != -1){
			// 새로운 설정이 있다.
			if(location.href.indexOf("&", location.href.indexOf("&lang=") + 6) != -1){
				// 다른 파라미터가 있는 경우
				var index = location.href.indexOf("&lang=") + 6;
				var length = location.href.indexOf("&", location.href.indexOf("&lang=") + 6 ) - index;
				langCode = location.href.substr(index, length);
			}else{
				// 파라미터가 없는 경우
				var index = location.href.indexOf("&lang=") + 6;
				var length = location.href.length - index;
				langCode = location.href.substr(index, length);
			}
		}

		if(!langCode){
			// URL에서 언어를 추출하지 못했다면, 기본 설정을 따른다.
			langCode = readCookie("langCode");

			if(!langCode){
				// 기본 설정된 언어가 없다면 영어로 설정한다.
				langCode = defaultLanguageCode;
			}
		}else{
			if(!isAvailableLangCode(langCode)){
				langCode = defaultLanguageCode;
			}
		}
		
		// 설정된 내용을 저장하고 해당 언어를 읽어들인다.
		createCookie("langCode", langCode, 365);
		loadData(langCode);
	}

	loadSettings();

	$(document).ready(function(){
		$('#slideshow').attr('title',	lang.getString("ID_SLIDESHOW"));
		$('#smallSize').attr('title',	lang.getString("ID_SMALL_SIZE"));
		$('#mediumSize').attr('title',	lang.getString("ID_MEDIUM_SIZE"));
		$('#bigSize').attr('title',		lang.getString("ID_BIG_SIZE"));

		document.title = lang.getString("ID_TITLE");
	});
})(  window.lang = window.lang || {} );