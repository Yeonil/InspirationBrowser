/*
	Inspiration Browser

	http://inspirationbrowser.com
	https://github.com/Yeonil/InspirationBrowser
	
	제작 및 배포: 훠닐(http://hornil.com)
	
	버전 1.3	릴리즈 노트
		
		- 스라이드쇼에서 터치 이벤트 추가.(데스크탑, 모바일 동시 사용 가능)
		- 다국어 지원 확장기능 추가함.
		- 광고 페이지를 상단으로 옮김, 보다 넓게 이미지 감상이 가능함.
		- 화면이 작은 장치에서 보다 더 잘 나오게 함.
		- 카테고리를 파라미터로 전달하게 함. category
		- 언어를 파라미터로 전달하게 함. lang, ex) 영어: lang=en, 한국어: lang=kr
		- 페이스북 댓글 쓰기 삭제 (사이트가 활성화가 되지 않고선 의미 없다고 판담함)
		- 작은창에서의 슬라이드쇼의 여러가지 문제를 해결.(크기 맞춤 등)

*/
;(function(dc){
	"use strict"
	
	var base = "http://inspirationbrowser.com/";
	var img = "img";
	var facebookAppID = "";

	var isMobile = { Android: false, BlackBerry: false, iOS: false, Opera: false, Windows: false, any: false };
	{
		isMobile.Android = navigator.userAgent.match(/Android/i);
		isMobile.BlackBerry = navigator.userAgent.match(/BlackBerry/i);
		isMobile.iOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);
		isMobile.Opera = navigator.userAgent.match(/Opera Mini/i);
		isMobile.Windows = navigator.userAgent.match(/IEMobile/i);
		isMobile.any = isMobile.Android || isMobile.BlackBerry || isMobile.iOS || isMobile.Opera || isMobile.Windows;
	}

	var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	var isFirefox = typeof InstallTrigger !== 'undefined'; 
	var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
	var isChrome = !!window.chrome && !isOpera;
	var isIE = /*@cc_on!@*/false || !!document.documentMode;
	
	var mjQuery = null;
	var initMobileProcessed = false;
	if(isMobile.any){
		if($(window).width() < 728){
			$('#mainviewport').attr("content", "width=728, user-scalable=no");
		}
	}

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
	
	// XML 중에 네임스페이스를 사용하는 노드의 값을 가져오는 경우에 사용한다.
	function loadNamespaceObject($, namespace, name){
		var object = $.find(namespace + "\\:" + name);
		if( object.length == 0 ){
			object = $.find(name);
		}
		return object;
	}

	function getRandom(start, end){
		return (( Math.random() * end) + start) | 0;
	}

	var menus = [ 
		{id:"all",			text:"ID_ALL",			elementID:"menuItemAll"},
		{id:"general",		text:"ID_GENERAL",		elementID:"menuItemGeneral" },
		{id:"web",			text:"ID_WEB",			elementID:"menuItemWeb"},
		{id:"logo",			text:"ID_LOGO",			elementID:"menuItemLogo"},
		{id:"architecture", text:"ID_ARCHITECTURE",	elementID:"menuItemHouse"},
		{id:"fashion",		text:"ID_FASHION",		elementID:"menuItemFashion"},
		{id:"photo",		text:"ID_PHOTO",		elementID:"menuItemPhoto"},
		{id:"car",			text:"ID_CAR",			elementID:"menuItemCar"},
		{id:"etc",			text:"ID_ETC",			elementID:"menuItemEtc"},
		{id:"allMedia",		text:"ID_ALLMEDIA",		elementID:"menuItemAllMedia"},
	];							

	var categories = null;
	var category = null;
	var defaultCategoryName = "general";

	function Feed( _category, feedInfo ){
		var This = this;
		feedInfo.feed = this;
		this.category = _category;
		this.feedInfo = feedInfo;
		this.items = [];

		this.load = function(){
			$.ajax({
				type: "POST",
				url: base + "ib_ajax.php",
				data: { url: this.feedInfo.url }
			}).done( function( data ) {
				var $xml = $($.parseXML(data));
				(This.feedInfo.parsing)?otherParsing(This, $xml):defaultParsing(This,$xml);
				This.feedInfo.loadded = true;

				if(!This.feedInfo.onlyMedia)
					This.category.items.push({isTitle: true, feedInfo: This.feedInfo, show: function(){ addFeedInfo(this.feedInfo); } });			
				
				This.category.addItems(This.items);
				This.category.increaseLoad();
			}).error( function(xhr, errorType, exception){
				//var errorMessage = exception || xhr.statusText;
				//alert(errorMessage);
				This.category.increaseLoad();
			});
		}

		function defaultParsing(feed, $xml){
			feed.items = [];
			var Max = 20;
			var Index = 0;

			$xml.find("item").each(function(){
				if(Max <= Index){ return false; }
				Index++;

				var item = {
					isTitle: false,
					title: $(this).find("title").text(),
					link: $(this).find("link").text(),
					comments: $(this).find("comments").text(),
					pubDate: $(this).find("pubDate").text(),
					creator: loadNamespaceObject($(this), "dc", "creator").text(),
					content_encoded: loadNamespaceObject($(this), "content", "encoded").text(),
					desc: $(this).find("description").text(),
					href: $(this).find("link").text(),
					loadded: false,
					feedObject: This,
					show: function(){
						var itemObject = this;
						var $html = null;
						var $temp = $('<div></div>');
						if(this.feedObject.feedInfo.done == "doneFeedBurnerEncoded"){
							$html = $($.parseHTML(this.content_encoded));
						}else{
							$html = $($.parseHTML(this.desc));
						}
						$temp.append($html);
						
						if(this.feedObject.feedInfo.onlyMedia){
							var element = $temp.find("iframe").first();
							if(1 <= element.length){
								var height = element.height();
								if( 50 < height ){
									element.css( {width: baseSize.width} ).addClass("srcElement");
									if(height){ element.css( {height: height * 3 / 4} ); }
									itemObject.loadded = true;
									addItem( element, itemObject);
								}
							}
						}else{
							var element = $temp.find("iframe").first();
							if(element.length != 1){
								var img = $temp.find("img").first();
								var src = img.attr("src");
								if(img.length != 0 && src.indexOf("http") == -1){
									img.attr("src", this.feedObject.feedInfo.site + img.attr("src"));
								}
								$temp.find("img").first().load( function(){
									if(this.height < 50 ){
										$(this).remove();
									}else{
										$(this).addClass("srcElement").removeAttr("height");
										$(this).css({height:''});
										itemObject.loadded = true;
										addItem( $(this), itemObject);
									}
								}).error(function(){
									$(this).remove();
								});
							}else{
								var height = element.height();
								if( 50 < height ){
									element.css( {width: baseSize.width} ).addClass("srcElement");
									if(height){ element.css( {height: height * 3 / 4} ); }
									itemObject.loadded = true;
									addItem( element, itemObject);
								}
							}
						}
					},
					hide: function(){
					}
				}
				feed.items.push ( item );
			});
		}

		function defaultParsingAtom(feed, $xml){
			feed.items = [];
			var Max = 20;
			var Index = 0;

			$xml.find("entry").each(function(){
				if(Max <= Index){ return false; }
				Index++;

				var item = {
					isTitle: false,
					title: $(this).find("title").text(),
					link: $(this).find("link").attr("href"),
					comments: "",
					pubDate: $(this).find("updated").text(),
					creator: "",
					content_encoded:  $(this).find("content").text(),
					desc: "",
					href: $(this).find("link").attr("href"),
					loadded: false,
					feedObject: This,
					show: function(){
						var itemObject = this;
						var $html = $($.parseHTML(this.content_encoded));
						var $temp = $('<div></div>');
						$temp.append($html);

						if(this.feedObject.feedInfo.onlyMedia){
							var element = $temp.find("iframe").first();
							if(1 <= element.length){
								var height = element.height();
								if( 50 < height ){
									element.css( {width: baseSize.width} ).addClass("srcElement");
									if(height){ element.css( {height: height * 3 / 4} ); }
									itemObject.loadded = true;
									addItem( element, itemObject);
								}				
							}
						}else{
							var element = $temp.find("iframe").first();
							if(element.length != 1){
								var img = $temp.find("img").first();
								var src = img.attr("src");
								if(img.length != 0 && src.indexOf("http") == -1){
									if(src.indexOf("//") == 0){
										img.attr("src", "http:" + img.attr("src"));							
									}else{
										img.attr("src", this.feedObject.feedInfo.site + img.attr("src"));
									}
								}
								$temp.find("img").first().load( function(){
									$(this).attr("width", this.width);
									$(this).attr("height", this.height);
									if(this.height < 50 ){
										$(this).remove();
									}else{
										$(this).addClass("srcElement").removeAttr("height");
										$(this).css({height:''});
										itemObject.loadded = true;
										addItem( $(this), itemObject);		
									}
								}).error(function(){
									$(this).remove();
								});
							}else{
								var height = element.height();
								if( 50 < height ){
									element.css( {width: baseSize.width} ).addClass("srcElement");
									if(height){ element.css( {height: height * 3 / 4} ); }
									itemObject.loadded = true;
									addItem( element, itemObject);
								}				
							}
						}
					},
					hide: function(){
					}
				}
				feed.items.push ( item );
			});
		}

		function otherParsing(feed, $xml, parsingFuncName){
			switch(parsingFuncName){
			case "atom": defaultParsingAtom(feed, $xml); break;
			}
		}
	} // end of the Feed function
	
	function addFeedInfo( feedInfo ){
		var $item = $('<div class="item feed"><div class="favicon"></div><div class="text" title="'+feedInfo.site+'">'+feedInfo.name+'</div></div>').css( { width: baseSize.width });
		$item.find(".text").css({cursor:"pointer"}).click(function(){ window.open(feedInfo.site, '_blank');});
		$('#container').append( $item );
		$item.fadeIn();
		$('<img/>').load(function(){ 
			$item.children(".favicon").append($(this)); 
		}).attr("src", "https://getfavicon.appspot.com/" + feedInfo.site);
		updateLayout();
	}

	function addItem( object, feedItem){
		var $item = $('<div class="item"></div>').append( object ).css( { width: baseSize.width }).attr("imgpath", object.attr("src"));
		var dateString = feedItem.pubDate.replace("+0000","");

		if(object.is("iframe")){
			var overlayTopBack		= $('<div class="overlayTopBack "></div>');
			var overlayTopText		= $('<div class="text">'+feedItem.title+'</div>');
			var overlayTopAuthor	= $('<div class="author">by '+feedItem.creator+', ' + dateString + '<p><a target="_blank" href="'+feedItem.link+'">'+lang.getString('ID_VISIT_WEBSITE')+'</a></p></div>');
			var overlayTop			= $('<div class="overlayTop"></div>').append(overlayTopText).append(overlayTopAuthor);
			//$item.append(overlayTopBack).append(overlayTop);
			$item.append(overlayTop);
		}else{
			var pinitbutton = $('<img class="pinit" src="'+base + img + '/sns_pinterest.png" />');
			var facebookbutton = $('<img class="facebookbutton" src="'+base + img + '/sns_facebook.png" />');

			pinitbutton.click(function(){
				var width = 750;
				var height = 310;
				var left = (screen.width - width) / 2;
				var top = (screen.height - height) / 2;
				var desc = feedItem.title + ((feedItem.creator!="")?(" by " + feedItem.creator):"") + " via " + base; 
				var url = 'http://www.pinterest.com/pin/create/button/?url=' + feedItem.link + '&media='+object.attr("src")+'&description='+escape(desc);
				var myWindow = window.open(url,"_blank","width="+width+",height="+height+",left="+left+",top="+top+"");
			});

			facebookbutton.click(function(){	

				FB.ui(
				  {
					method: 'stream.publish',
					display: 'popup',
					link: feedItem.link,
					picture: object.attr("src"),
					name: feedItem.title,
					//caption: feedItem.title + ((feedItem.creator!="")?(" by " + feedItem.creator):""),
					description: ((feedItem.creator!="")?(" by " + feedItem.creator):"") + " via " + base;
					properties: {
						"Inspiration Browser": { text: "Let's get inspired.", href: base }
					}
				  },
				  function(response) {
					if (response && response.post_id) {
					  //alert('Post was published.');
					} else {
					 // alert('Post was not published.');
					}
				  }
				);

			});

			var defaultInfoBack		= $('<div class="defaultDescBack">'+feedItem.title+'</div>');
			var overlayTopBack		= $('<div class="overlayTopBack"></div>');
			var overlayTopText		= $('<div class="text">'+feedItem.title+'</div>');
			var overlayTopAuthor	= $('<div class="author">by '+feedItem.creator+', ' + dateString + '</div>');
			var overlayTop			= $('<div class="overlayTop"></div>').append(overlayTopText).append(overlayTopAuthor);
			var overlayBottomBack	= $('<div class="overlayBottomBack"></div>');
			var overlayBottomText1	= $('<div class="text link" title="' + feedItem.link + '">'+lang.getString('ID_VISIT_WEBSITE')+'</div>');
			var overlayBottomText2	= $('<div class="text fullscreen" title="'+lang.getString('ID_FIT_TO_WINDOW')+'"><img src="'+base+ img + '/fullscreen.png"/></div>');
			var overlayBottom		= $('<div class="overlayBottom"></div>').append(pinitbutton).append(facebookbutton).append(overlayBottomText1).append(overlayBottomText2);
			var bottomInfo			= $('<div class="bottomInfo"></div>');
			
			$item.append(defaultInfoBack).append(overlayTopBack).append(overlayTop).append(overlayBottomBack).append(overlayBottom);
			
			overlayBottomText1.css({cursor:"pointer"}).click(function(){ window.open(feedItem.link, '_blank');	});
			overlayBottomText2.css({cursor:"pointer"}).click(function(){ showFullImage($item, true); });
			overlayTopBack.css({cursor:"pointer"}).click(function(){ showFullImage($item, true); });
			overlayTop.css({cursor:"pointer"}).click(function(){ showFullImage($item, true); });
		}
		$('#container').append( $item );
		$item.fadeIn();
		$item.mouseenter(function(){
			$(this).children(".overlayTopBack, .overlayBottomBack").stop().fadeIn("fast", function(){
				$item.children(".overlayTop").fadeIn("fast");
				$item.children(".overlayBottom").fadeIn("fast");
			});
			$(this).children(".defaultDescBack, .defaultDesc").stop().fadeOut("fast");
		}).mouseleave(function(event){
			$(this).children(".overlayTopBack, .overlayBottomBack, .overlayTop, .overlayBottom").stop().fadeOut("fast");
			//$(this).children(".defaultDescBack, .defaultDesc").stop().fadeIn("fast");
		});
		updateLayout();
	}

	function removeItem( object ){
		var items = $('#container').find(".item");
		items.each( function(){			
			if( $(this)[0] == object[0]){
				$(this).parent().remove();
				updateLayout();
			}
		});
	}
	
	var iCurrentImage = 0;
	function showPreviousImage(checkControls){ showPreviousOrNext(true, checkControls);	}
	function showNextImage(checkControls){ showPreviousOrNext(false,checkControls); }
	function showPreviousOrNext(previous,checkControls){
		var items = $('#container').find("img.srcElement");
		var oldPos = iCurrentImage;
		if(previous){
			if( 0 < iCurrentImage ){
				iCurrentImage--;
			}else{
				iCurrentImage = items.length - 1;
			}
		}else{
			if( iCurrentImage < items.length - 1){
				iCurrentImage++;
			}else{
				iCurrentImage = 0;
			}
		}
		if(0 <= iCurrentImage && iCurrentImage < items.length)
			showFullImage( $(items[iCurrentImage]).parent(),checkControls );
	}

	function showFullImage( item, checkControls ){
		hideOthers();
		setFullscreenMode();
		
		var items = $('#container').find("img.srcElement");
		items.each( function( index ){			
			if( $(this)[0] == item[0]){
				iCurrentImage = index;
			}
		});

		$('#fullImageViewBack, #fullImageView').fadeIn("slow");
		$('#fullImageViewContent').find("img").fadeOut("fast", function(){ $(this).remove(); });

		var $img = item.find("img.srcElement");
		if($img.length == 1){

			$img.attr("nopin","");

			$('#fullImageTitle').text( item.children(".defaultDescBack").text() ); 
			$('#fullImageAuthor').text( item.find(".author").text() ); 
			$('#fullImageLink').off('click').click(function(event){
				event.stopPropagation(); 
				var url = item.find(".link").attr("title");
				$(this).attr("title", url );
				window.open( url , '_blank');
			})

			var img = $('<img/>');						
			img.load(function(){
				$('#fullImageViewContent').append( $(this) );				
				$(this).hide();
				
				var contentOffset = $('#fullImageViewContent').offset();
				var commentWidth = 0;
				var innerPadding = 160; // 이미지에 대한 추가 설명이 들어갈 공간 확보를 위함.


				var imageWidth = $(this).width();
				var imageHeight = $(this).height();
				var windowWidth = $(window).width() - innerPadding - commentWidth;
				var windowHeight = $(window).height() - innerPadding - 50;
				var width;
				var height;
				if(windowWidth < imageWidth || windowHeight < imageHeight){ 
					width = windowWidth;
					height = windowWidth * imageHeight / imageWidth;
					if( windowHeight < height ){
						height = windowHeight;
						width = windowHeight * imageWidth / imageHeight;
					}
				}else{
					width = imageWidth;
					height = imageHeight;
				}

				fullImageSize.width = width;
				fullImageSize.height = height;

				
				var offset = {left: ($(window).width() - commentWidth - width)/ 2, top: ($(window).height() - height)/ 2};
				offset.top = Math.max(110, offset.top);
				offset.left -= contentOffset.left;
				offset.top -= 90;

				$(this).css({left:offset.left, top: offset.top, width: width, height: height });		
				

				offset.left += contentOffset.left;
				offset.top += 50;

				var buttonTop = offset.top + height / 2 - 66; 
				$('#previousImageButton').css( { left: 40, top: buttonTop} );
				$('#nextImageButton').css( { right: 40 + commentWidth, top:buttonTop} );
				$('#fullImageDesc').css( { left: offset.left, top: offset.top + height + 10, width: width } );
				
				$(this).fadeIn();

				$('#fullImagePinitbutton').off('click').click(function(event){
					event.stopPropagation();
					
					var width = 750;
					var height = 310;
					var left = (screen.width - width) / 2;
					var top = (screen.height - height) / 2;
					var desc = item.children(".defaultDescBack").text() + ((item.find(".author").text()!="")?(" by " + item.find(".author").text()):"") + " via " + base;
					var url = 'http://www.pinterest.com/pin/create/button/?url=' + item.find(".link").attr("title") + '&media='+item.attr("imgpath")+'&description='+escape(desc);
					var myWindow = window.open(url,"_blank","width="+width+",height="+height+",left="+left+",top="+top+"");

				});  

				$('#fullImageFacebookbutton').off('click').click(function(event){
					event.stopPropagation();

					var text = item.find(".author").text();
					
					FB.ui(
					  {
						method: 'stream.publish',
						display: 'popup',
						link: item.find(".link").attr("title"),
						picture: item.attr("imgpath"),
						name: item.children(".defaultDescBack").text(),
						description: " via " + base,
						properties: {
							"Inspiration Browser": { text: "Let's get inspired.", href: base }
						}
					  },
					  function(response) {
						if (response && response.post_id) {
						} else {
						}
					  }
					);

				});

				//var comments = '<fb:comments id="fbcomments" href="'+item.attr("imgpath")+'" numposts="3" width="'+ (commentWidth - 28)+'" colorscheme="light"></fb:comments>';
				//$('#fullImageComments').children().remove();
				//$('#fullImageComments').hide();
				//$('#fullImageComments').html( comments );	
				//FB.XFBML.parse($('#fullImageComments')[0], function(){
				//	$('#fullImageComments').fadeIn("fast");
				//});

				if(checkControls){
					$('#previousImageButton, #nextImageButton').fadeIn("slow");
					checkSlideshowControls();
				}

			});


			

			img.attr("src", item.attr("imgpath"));
		}
	}
	
	function hideFullImage(){
		$('#pinitbuttonbox').fadeOut("fast");
		$('#container').find("img.srcElement").attr("nopin","");
		$('#fullImageViewBack, #fullImageView').stop().fadeOut("fast");
		stopCheckSlideshowControls();
		releaseFullscreenMode();
		updateLayout();
	}

	//
	// 레이아웃(배치) 관련
	// 
	var smallSize = 250;
	var mediumSize = 336;
	var bigSize = 450;

	var bgColors =		["#8DB900", "#B77000", "#A51300"];
	var colors =		["#C6FF00", "#F19702", "#F12001"];
	var hoverColors =	["#D6FF50", "#FFBA4C", "#FF5944"];

	var baseSize = { width: mediumSize };
	var padding = { x: 15, y: 15};
	var nowUpdateLayout = false;
	var previousColumnCount = 0;
	var emptyColumns = [];


	var fullImageSize = {width:0, height:0};
	
	function checkMemory(){
		return;
	}

	function updateLayout(){
		if(nowUpdateLayout)return;
		nowUpdateLayout = true;

		var width = baseSize.width;		
		var items = $('#container').children(".item");

		var columnCount = ($('#container').width() / (width + padding.x) ) | 0;
		columnCount = Math.max(1, columnCount);

		items.each(function(){
			$(this).width(width);
			$(this).find(".srcElement").each( function(){
				$(this).width(width);
			});
		});
		
		var distance = $('#container').width() - ( columnCount * (width + padding.x) );
		width += (distance / columnCount) | 0;
		items.each(function(){
			$(this).width(width);
			$(this).find(".srcElement").each( function(){
				$(this).width(width);
			});
		});

		var temps = $('#container').children(".temp");
		temps.each(function(){$(this).remove();});

		var offset = $('#container').offset();
		offset.left = 0;
		offset.top = 0;
		var newOffset = {left: 0, top: 0};

		var columns = [];
		for(var iColumn = 0; iColumn < columnCount; iColumn++){
			columns.push( { left: padding.x + offset.left + iColumn * ( width + padding.x), top:  offset.top });
		}
		
		var maxTop = 0;
		for(var iItem = 0; iItem < items.length; iItem++){
			var item = items[iItem];
			
			var iColumn = 0;
			var minTop = columns[0].top;
			for(var iCol = 0; iCol < columns.length; iCol++){
				if( columns[iCol].top < minTop ){
					minTop = columns[iCol].top;
					iColumn = iCol;
				}
			}
			var column = columns[iColumn];

			newOffset.left = column.left | 0;
			newOffset.top = column.top | 0;

			column.top += $(item).height() + padding.y;
			
			$(item).css( { left: newOffset.left, top: newOffset.top } ); 
			$(item).find(".overlayTopBack, .overlayTop").each(function(){ $(this).css({ height: '' }); });

			maxTop = Math.max(column.top, maxTop);
		}

		$('#container').css( { height: maxTop - padding.y - offset.top } );

		// 모자란 영역 깔끔히 채우기
		for(var iColumn = 0; iColumn < columns.length; iColumn++){
			var column = columns[iColumn];
			if( column.top < maxTop ){
				var temp = $('<div class="temp"></div>');
				var height = maxTop - padding.y - column.top;
				temp.css( { left: column.left, top: column.top, height: height, width: width} );
				$('#container').append(temp);
			}
		}

		$('#ShowMoreBox').css({top: maxTop + $('#container').offset().top });
		if( ShowMore.available()){

			$('#ShowMore').show().addClass("available").attr("title",lang.getString("ID_SHOW_MORE")).text(lang.getString("ID_SHOW_MORE")).off('click').click(function(){
				$(this).text(lang.getString("ID_NOW_LOADING")); $(this).off('click'); if(ShowMore.available()) ShowMore.more(20); 
			});
		}else{
			$('#ShowMore').removeClass("available").attr("title",lang.getString("ID_NO_MORE_ITEMS")).text(lang.getString("ID_NO_MORE_ITEMS")).off('click');
		}

		if($('#fullImageViewBack').is(":visible")){
			$('#fullImageViewContent').find("img:first-child").each(function(){

				var contentOffset = $('#fullImageViewContent').offset();
				var commentWidth = 0;
				var innerPadding = 160; // 이미지에 대한 추가 설명이 들어갈 공간 확보를 위함.


				var imageWidth = fullImageSize.width;//$(this).width();
				var imageHeight = fullImageSize.height;//$(this).height();
				var windowWidth = $(window).width() - innerPadding - commentWidth;
				var windowHeight = $(window).height() - innerPadding - 50;
				var width;
				var height;
				if(windowWidth < imageWidth || windowHeight < imageHeight){ 
					width = windowWidth;
					height = windowWidth * imageHeight / imageWidth;
					if( windowHeight < height ){
						height = windowHeight;
						width = windowHeight * imageWidth / imageHeight;
					}
				}else{
					width = imageWidth;
					height = imageHeight;
				}
				
				var offset = { left: ($(window).width() - commentWidth - width)/ 2, top: ($(window).height() - height)/ 2 };
				offset.top = Math.max(110, offset.top);
				offset.left -= contentOffset.left;
				offset.top -= 90;

				$(this).css( { left: offset.left, top: offset.top, width: width, height: height });


				offset.left += contentOffset.left;
				offset.top += 50;

				var buttonTop = offset.top + height / 2 - 66;
				$('#previousImageButton').css( { left: 40, top: buttonTop} ).fadeIn("slow");
				$('#nextImageButton').css( { right: 40 + commentWidth, top: buttonTop} ).fadeIn("slow");
				$('#fullImageDesc').css( { left: offset.left, top: offset.top + height + 10, width: width } );
				
				//$('#fullImageComments').css({ right: 100, top: 100, bottom: 150, width: commentWidth });
			});
		}

		$('#bottomLinks').css( {left: offset.left, top: 60 + maxTop } );

		/*
		if( $(window).width() < 900){
			$('#containerHeader .size').removeClass("wide");
			$('#containerHeader .size').addClass("narrow");

			var top = $('#container').offset().top;
			if(top != 130)
				$('#container').css({ top: 130 });
			$('#menuBox').css( {top:120 } );
		}else{
			$('#containerHeader > .size').removeClass("narrow");
			$('#containerHeader > .size').addClass("wide");
			var top = $('#container').offset().top;
			if(top != 75)
				$('#container').css({ top: 75 });
			$('#menuBox').css( {top:60 } );
		}
		*/

		var menuColumn = 3;
		$('.menuItem').css( {width: ($(window).width() / menuColumn) - (15 * (menuColumn)) } );

		checkAd(maxTop);

		nowUpdateLayout = false;
	}

	function checkAd(maxTop){
		//var docHeight = maxTop;
		//var top = $('#ad1').offset().top;
		//if( top + 265 * 2< docHeight) { $('#ad2').stop().fadeIn("slow"); }else {$('#ad2').stop().fadeOut("slow"); } 
		//if( top + 265 * 3 < docHeight){ $('#ad3').stop().fadeIn("slow"); }else {$('#ad3').stop().fadeOut("slow");}
		//if( top + 265 * 4 < docHeight){ $('#ad4').stop().fadeIn("slow"); }else {$('#ad4').stop().fadeOut("slow");}
		//if( top + 265 * 5 < docHeight){ $('#ad5').stop().fadeIn("slow"); }else {$('#ad5').stop().fadeOut("slow");}
		//if( top + 1600 < docHeight){ $('#ad6').stop().fadeIn("slow"); }else {$('#ad6').stop().fadeOut("slow");}
	}

	function changeBaseSize(width){
		baseSize.width = width;
		if(typeof(Storage)!== "undefined") {
			try{
				localStorage.setItem("baseSizeWidth", baseSize.width);			
			}catch(e){
			
			}
		}else{
			eraseCookie("baseSizeWidth");
			createCookie("baseSizeWidth", baseSize.width, 365);
		}
		updateSizeButtons();
		updateLayout();
	}

	function updateSizeButtons(){
		$('#smallSize, #mediumSize, #bigSize').removeClass("selected");
		switch(baseSize.width){
		case smallSize: $('#smallSize').addClass("selected"); break;
		case mediumSize: $('#mediumSize').addClass("selected"); break;
		case bigSize: $('#bigSize').addClass("selected"); break;
		}
	}

	var slideshowTimer = null;
	var mousePos = {x:0, y:0};
	var checkMousePos = {x: 0, y:0};
	
	function stopCheckSlideshowControls(){
		clearTimeout(slideshowTimer);
	}
	
	function checkSlideshowControls(){
		if(checkMousePos.x == mousePos.x && checkMousePos.y == mousePos.y){
			if(!mouseIsInSlideshowControls() && !isMobile.any){
				showSlideshowControls(false);
			}
		}else{
			showSlideshowControls(true);
		}

		checkMousePos.x = mousePos.x;
		checkMousePos.y = mousePos.y;

		if(slideshowTimer) clearTimeout(slideshowTimer);
		slideshowTimer = setTimeout(checkSlideshowControls, 1000);
	}
	
	function isInObject(obj,pos){
		var offset = obj.offset();
		if(offset.left <= pos.x && offset.top <= pos.y && pos.x < (offset.left + obj.width()) && pos.y < (offset.top + obj.height()) ){
			return true;
		}
		return false;
	}

	function mouseIsInSlideshowControls(){
		if(isInObject( $('#previousImageButton'), mousePos) || isInObject($('#nextImageButton'), mousePos))
			return true;
		return false;
	}
	
	function showSlideshowControls(show){
		if(show){
			$('#previousImageButton, #nextImageButton').stop().fadeIn("slow");
		}else{
			$('#previousImageButton, #nextImageButton').stop().fadeOut("slow");
		}
	}
	
	function makeMenu(){
		$('#menu').children().remove();
		
		if(categories){

			for(var iCategory = 0; iCategory < categories.length; iCategory++){
				var _category = categories[iCategory];
				
				for(var iMenu = 0; iMenu < menus.length; iMenu++){
					if(menus[iMenu].id == _category.name){
						var menuItem = $('<div id="' + menus[iMenu].elementID +'" class="menuItem">'+ lang.getString(menus[iMenu].text)+'</div>');
						menuItem.attr("category", _category.name);
						menuItem.click(function(){
							
							//reloadCategory( $(this).attr("category") );
							location.href = base + "?category=" + $(this).attr("category");
						});
						$('#menu').append( menuItem );
						break;
					}
				}
			}
		}
		
		var menuItem = $('<div id="menuCloseButton" class="menuItem menuClose">'+lang.getString("ID_CLOSE")+'</div>').off('click').click(function(){ showMenu(false); });
		$('#menu').append( menuItem );
	}

	function loadCategories(){
		$.ajax({
			type: "POST",
			url: base + "ib_feeds.php",
			dataType: "json"
		}).done( function( data ) {
			categories = data;

			var all = { name: "all", feeds: []};
			var allMedia = { name: "allMedia", feeds: []};

			for(var iCategory = 0; iCategory < categories.length; iCategory++){
				var _category = categories[iCategory];
				_category.onlyIframe = false;
				for(var iFeed = 0; iFeed < _category.feeds.length; iFeed++){
					var _item = _category.feeds[iFeed];
					var item = {
						name: _item.name,
						site: _item.site,
						url: _item.url,
						loadded: _item.loadded,
						feed: _item.parsing,
						done: _item.done,
						onlyMedia: false
					};
					all.feeds.push(item);
					//var item2 = {
					//	name: _item.name,
					//	site: _item.site,
					//	url: _item.url,
					//	loadded: _item.loadded,
					//	feed: _item.parsing,
					//	done: _item.done,
					//	onlyMedia: true
					//}
					//allMedia.feeds.push(item2);
				}
			}

			categories.unshift(all);
			//allMedia.onlyMedia = true;
			//categories.push(allMedia);

			makeMenu();
			initCategories();
			loadCategory( defaultCategoryName );
			
		}).error( function(xhr, errorType, exception){
			//var errorMessage = exception || xhr.statusText;
			//alert(errorMessage);
			makeMenu();
		});
	}

	function initCategories(){
		if(!categories) 
			return;
		
		for(var iCategory = 0; iCategory < categories.length; iCategory++){
			var _category = categories[iCategory];
			_category.loadCount = 0;
			_category.items = [];
			_category.firstShowCount = 10;
			_category.onlyMedia = false;

			_category.addItems = function( _items ){
				var This = this;
				for(var iItem = 0 ; iItem < _items.length; iItem++){
					This.items.push(_items[iItem]);
				}
			};

			_category.checkLoadAndShow = function(){
				var This = this;
				if(This.firstShowCount < This.items.length){
					var max = isMobile.any?20:50;
					if(This.firstShowCount < max){
						var num = (This.onlyMedia)?50:10;
						//alert(num);
						This.firstShowCount += num;
						ShowMore.more(num);		
					}
				}	
			};

			_category.increaseLoad = function(){
				this.loadCount++;
				if(this.loadCount == this.feeds.length){
					this.readyToShow = true;
					readyToShow();			
				}
				this.checkLoadAndShow();
			}
		}
	}

	function reloadCategory( categoryName ){
		// 깔끔히 이전 데이터를 삭제해 준다.
		$('#container').children(".item").each(function(){ $(this).remove(); });
		ShowMore.init();
		updateLayout();
		//$('#msg').text('Reload Category: ' + categoryName +' ');
		loadCategory( categoryName );
		hideOthers();
	}

	// 카테고리내에 있는 피드들을 읽어들인다.
	function loadCategory( categoryName ){
		var isInList = false;
		
		for(var iCategory = 0; iCategory < categories.length; iCategory++){
			var _category = categories[iCategory];
			if(_category.name == categoryName){
				isInList = true;
				loadCategoryFeeds( _category );
				break;
			}
		}

		if(!isInList){
			return;
		}

		// Update infomation
		$('#menuItemAll, #menuItemGeneral, #menuItemWeb, #menuItemLogo, #menuItemHouse, #menuItemFashion, #menuItemEtc').removeClass("selected");
		var subTitle = "";
		for(var iMenu = 0; iMenu < menus.length; iMenu++){
			var menu = menus[iMenu];
			if( menu.id == categoryName){
				$('#' + menu.elementID).addClass("selected");
				subTitle = lang.getString(menu.text);
				break;
			}
		}
		$('#titleCategory').text("(" + subTitle + ")");	

		defaultCategoryName = categoryName;
		if(typeof(Storage)!=="undefined") {
			localStorage.setItem("defaultCategory", defaultCategoryName);
		}else{
			eraseCookie("defaultCategory");
			createCookie("defaultCategory", defaultCategoryName, 365);
		}
	}

	function loadCategoryFeeds( _category ){
		category = _category;		
		category.loadCount = 0;
		category.firstShowCount = 10;
		var time = 0, delay = 200;
		for(var iFeed = 0; iFeed < _category.feeds.length; iFeed++){
			loadFeedAfterTime( _category, iFeed, time);
			time += delay;
		}
	}

	function loadFeedAfterTime( _category, iFeed, time){ 
		loadFeed( _category, iFeed ); 
	}

	// 하나의 피드를 읽어들인다.
	function loadFeed( _category, iFeed ){
		if(!_category.feeds[iFeed].loadded){
			var feed = new Feed( _category, _category.feeds[iFeed] );
			feed.load();
		}else{
			_category.increaseLoad();
		}
	}

	function readyToShow(){
	}

	var ShowMore = {
		nowLoading: false,
		startIndex: 0,
		stopIndex: 0,

		init: function(){
			this.nowLoading = false;
			this.startIndex = 0;
			this.stopIndex = 0;
		},
		available: function(){
			if(!category) return false;

			if(isMobile.any){
				return (this.startIndex + 10) < category.items.length && this.startIndex < 100;	
			}else{
				if(isIE){
					return (this.startIndex + 10) < category.items.length && this.startIndex < 300;			
				}else{
					return (this.startIndex + 10) < category.items.length;
				}
			}
		},
		more: function( max ){
			if(!category){	return;	}
			if(ShowMore.nowLoading){ return; }
			if(!this.available()){ return;	}

			this.nowLoading = true;
			this.stopIndex = this.startIndex + max;
			if( this.startIndex < this.stopIndex ){
				var time = 0;
				for(var iItem = this.startIndex; iItem < category.items.length; iItem++){
					time+= 100;
					if(this.stopIndex <= iItem){
						this.nowLoading = false;
						break;
					}else{
						this.startIndex++;
						this.showAfter(category.items[iItem], time);
					}				
				}
				this.nowLoading = false;
			}else{
				this.nowLoading = false;
			}
			$('#msg').text('more: '+ category.items.length + ", " + this.startIndex);
		},
		showAfter: function(item, time){
			setTimeout(function(){
				item.show();
			}, time);
		}
	}

	function setFullscreenMode(){
		// 구형 브라우저에서는 스크롤바 감추기가 되지 않는 경우가 있어 상단바를 고정시켜 스크롤 방지와 비슷한 효과를 구현한다.
		$('#containerHeaderBox, #adContainerHeaderBox').css( {position:"fixed"} );
		$('body').css( {overflowY:"hidden"} );
	}

	function releaseFullscreenMode(){
		$('body').css( {overflowY:"auto"} );
		$('#containerHeaderBox, #adContainerHeaderBox').css( {position:"fixed"} );
	}
	
	function showMenu(show){
		hideOthers();
		if(show){
			setFullscreenMode();
			$('#menuBox').css({height:''}).stop().slideDown();
			$('#adContainer').hide();
		}else{
			releaseFullscreenMode();
			$('#menuBox').stop().slideUp();
		}
	}
	
	function showAbout(show){
		hideOthers();
		if(show){
			var src = $('#aboutImage').attr("src");
			if( src == "" || src == location.href){ // 구형 브라우저에선 src가 정의되어 있지 않을 경우 현재 경로를 출력하는 경우가 있다.
				$('#aboutImage').attr("src", base + img + "/AboutIB.png");
			}
			setFullscreenMode();
			$('#aboutBox').css({ height: '' }).stop().slideDown();

		}else{
			releaseFullscreenMode();
			$('#aboutBox').stop().slideUp();
		}
	}

	function toggleMenu() { if($('#menuBox').is(':visible')) { showMenu(false); }else { showMenu(true); } }
	function toggleAbout(){	if($('#aboutBox').is(':visible')){ showAbout(false); }else{	showAbout(true); } }
	
	function hideOthers(){
		releaseFullscreenMode();
		$('#menuBox, #aboutBox').stop().fadeOut("fast");
		$('#containerHeaderBox').css({right: 0}); // 이상하게도 기존 위치를 잃어버리는 경우가 생겨서 명시적으로 위치를 보정해 준다.
		//$('#adContainer').show();

		updateLayout();
	}
	
	function init(){
		$.ajaxSetup({ cache: true });

		if(isMobile.any){
			if( 728 <= $(window).width() ){
				smallSize = 200; // 4
				mediumSize = 300; // 3
				bigSize = 400; // 2
			}else if( 640 <= $(window).width() ){
				smallSize = 150; // 3
				mediumSize = 200; // 2
				bigSize = 300; // 1
			}
		}

		$.getScript('//connect.facebook.net/ko_KR/sdk.js', function(){
			FB.init({
				appId: facebookAppID,
				status: true,
				xfbml: true,
				version: 'v2.0',
			});     
			
			//$('#loginbutton,#feedbutton').removeAttr('disabled');
			//FB.getLoginStatus(function(msg){});			
			
			FB.XFBML.parse(document.getElementById('supportFacebookLike'));
		});

		$(window).bind('resize', onWindowResize);
		$(window).off('scroll').scroll(onWindowScroll);
		$(document).keydown(onGlobalKeyDown);
		$(document).mousemove(onGlobalMouseMove);

		$('#mainTitle').click( function(){ toggleAbout(); } );
		$('#aboutCloseButton').click(function(){ showAbout(false); });		
		$('#supportAboutButton').click(function(){ showAbout(true); });	
		//$('#menuButton, #titleCategory').click(function(){ toggleMenu(); });
		$('#titleCategory').click(function(){ toggleMenu(); });

		$('#smallSize').click(function(){ changeBaseSize(smallSize); });
		$('#mediumSize').click(function(){ changeBaseSize(mediumSize); });
		$('#bigSize').click(function(){ changeBaseSize(bigSize); });
	
		$('#slideshow').click(function(){ showFullImage($('#container').find("img.srcElement").first().parent(),true ); });
		$('#previousImageButton').click(function(event){ event.stopPropagation(); showPreviousImage(false);	});
		$('#nextImageButton').click(function(event){ event.stopPropagation(); showNextImage(false); });
		$('#titleCategory').mouseover( function(){ $(this).css({textDecoration:"underline"}) }).mouseout( function(){ $(this).css({textDecoration:"none"}) });
		$('#fullImageViewBack').bind('dragstart', function(event) {	event.preventDefault(); return false; });
		$('#fullImageViewBack').bind('selectstart', function(event) { event.preventDefault(); return false; });
		$('#fullImageViewBack, #fullImageView').click(function(){ hideFullImage();	});
		$('#fullImageViewContent, #fullImageComments').click(function(event){ event.stopPropagation();	});

		$('#fullscreenclosebutton').click(function(){	
			hideFullImage(); 
		});


		loadSettings();	
		loadCategories();

		$('#fullImageViewContent').bind('mousedown touchstart', function(event){
			touchDown = getPosition(event);

		}).bind('mouseup touchend',function(event){
			var nowTouchDown = getPosition(event);

			var amountX = touchDown.x - nowTouchDown.x;
			var amountY = touchDown.y - nowTouchDown.y;

			if(Math.abs(amountX) < Math.abs(amountY)){

			}else{
				if( 20 < Math.abs(amountX)){
					if(0 < amountX){
						//alert('좌측'); End <---- Start
						 showNextImage(false); 
					}else{
						//alert('우측'); Start ----> End
						showPreviousImage(false);
					}
				}
			}

			touchDown.x = -1;
			touchDown.y = -1;
		});
		
		/*
		$('#about').bind('mousedown touchstart', function(event){
			touchDown = getPosition(event);

		}).bind('mouseup touchend',function(event){
			var nowTouchDown = getPosition(event);

			var amountX = touchDown.x - nowTouchDown.x;
			var amountY = touchDown.y - nowTouchDown.y;

			if(Math.abs(amountX) < Math.abs(amountY)){
				if( 20 < Math.abs(amountY)){
					if(0 < amountY){
						showAbout(false);
					}
				}
			}

			touchDown.x = -1;
			touchDown.y = -1;
		});

		$('#menu').bind('mousedown touchstart', function(event){
			touchDown = getPosition(event);

		}).bind('mouseup touchend',function(event){
			var nowTouchDown = getPosition(event);

			var amountX = touchDown.x - nowTouchDown.x;
			var amountY = touchDown.y - nowTouchDown.y;

			if(Math.abs(amountX) < Math.abs(amountY)){
				if( 20 < Math.abs(amountY)){
					if(0 < amountY){
						showMenu(false);
					}
				}
			}

			touchDown.x = -1;
			touchDown.y = -1;
		});
		*/
	}

	var getPosition = function(e){
		var out = {x:0, y:0};
		if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			out.x = touch.pageX;
			out.y = touch.pageY;
		} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
			out.x = e.pageX;
			out.y = e.pageY;
		}
		return out;
    };

	var touchDown = { x:-1, y:-1};

	function initMobile(){
		$('#fullImageViewContent').on("swipeleft", function(event){ event.preventDefault(); showPreviousImage(false); } );
		$('#fullImageViewContent').on("swiperight", function(event){ event.preventDefault(); showNextImage(false); } );	
	}

	$(document).ready( init );

	function loadSettings(){
		defaultCategoryName = "general";
		baseSize.width = mediumSize;
		var beginPage = location.href;
		var firstCategory = null;
		
		var caregoryMark = "category=";
		var categoryIndex = beginPage.indexOf(caregoryMark);
		var category = "";
		if(categoryIndex != -1){
			category = beginPage.substr(categoryIndex + caregoryMark.length, beginPage.length - categoryIndex + caregoryMark.length);		
		}

		for(var iMenu = 0; iMenu < menus.length; iMenu++){
			var menuID = menus[iMenu].id;
			//if(beginPage.indexOf( base + menuID) != -1){
			if(category.indexOf(menuID) != -1){
				firstCategory = menuID;
				break;
			}
		}		
	
		if(firstCategory){			
			defaultCategoryName = firstCategory;
		}else{
			if(typeof(Storage)!=="undefined"){
				if(localStorage.getItem("defaultCategory")) 
					defaultCategoryName = localStorage.getItem("defaultCategory");
			}else{
				var _defaultCategory = readCookie("defaultCategory");
				if(_defaultCategory != null)
					defaultCategoryName = _defaultCategory;
			}
		}
		
		if(typeof(Storage)!=="undefined"){
			if(localStorage.getItem("baseSizeWidth"))
				baseSize.width = parseInt( localStorage.getItem("baseSizeWidth") );
		}else{
			var _baseSizeWidth = readCookie("baseSizeWidth");
			if(!_baseSizeWidth)
				baseSize.width = parseInt(_baseSizeWidth);
		}

		updateSizeButtons();
	}

	function onWindowResize(event){
		updateLayout();
	}

	var scrollTimeout = null;
	function onWindowScroll(event){
		checkMemory();
		if($(window).scrollTop() == $(document).height() - $(window).height()){ 
			ShowMore.more(isMobile.any?5:15);
			$(window).off('scroll');
			setTimeout(function(){
				$(window).scroll(onWindowScroll);
			}, 500);
		}
	}

	function onGlobalKeyDown(event){
		// 쉬프트 키 감지: event.shiftKey
		// 컨트롤 키 감지: event.ctrlKey
		handleSlideshow(event);
	}

	function handleSlideshow(event){
		switch(event.keyCode){
		case 37: showPreviousImage(false); break; // 왼쪽 방향키
		case 38: break; // 위 방향키
		case 39: showNextImage(false); break; // 오른쪽 방향키
		case 40: break; // 아래 방향키
		case 27: hideFullImage(); hideOthers(); break; // 탈출(Escape)키
		case 119: showFullImage($('#container').find("img.srcElement").first().parent(),true ); break;
		}
	}

	function onGlobalMouseMove(event){
		// 슬라이드쇼중에 컨트롤러를 감출지 보여줄지를 감지하기 위해 위치를 저장한다.
		mousePos.x = event.pageX;
		mousePos.y = event.pageY;
	}

	// jQuery 확장 (function($){ $.fn.shuffle = function() { return this.each(function(){ var items = $(this).children(); return (items.length) ? $(this).html($.shuffle(items)) : this;	}); } $.shuffle = function(arr) { for( var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x ); return arr; }})(jQuery);
})(  window.dc = window.dc || {} );