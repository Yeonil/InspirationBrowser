<?php
/*
	Inspiration Browser

	http://inspirationbrowser.com
	https://github.com/Yeonil/InspirationBrowser
	
	제작 및 배포: 훠닐(http://hornil.com)
*/
/*
	피드 목록을 JSON(JavaScript Object Notation)으로 만들어 출력한다.
	같은 도메인에서의 접근만을 위해 리퍼러와 POST방식인지를 확인한다.
*/
if ($_SERVER['REQUEST_METHOD'] === 'POST' ){
	// Feed 목록
	$category = array(
		array( "name"=>"general", 
			"feeds"=> array(	// 일반, 전체, 그래픽, 모호한 것들
			//array( "name"=>"booooooom",					"site"=> "http://www.booooooom.com/",			"url"=>"http://feeds.feedburner.com/BoomItsABlog",					"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),	
			array( "name"=>"Wishlist",				"site"=> "http://wishlist.soup.io/",		"url"=>"http://wishlist.soup.io/rss",					"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),	
			array( "name"=>"FFFFOUND!",				"site"=> "http://ffffound.com/",		"url"=>"http://feeds.feedburner.com/ffffound/everyone",					"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),	
			array( "name"=>"Design Aglow",				"site"=> "http://designaglow.com/blog/",		"url"=>"http://feeds.feedburner.com/DesignAglow",					"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),	
			array( "name"=>"The Design Inspiration",	"site"=> "http://thedesigninspiration.com/",	"url"=>"http://feeds2.feedburner.com/TheDesignInspiration",			"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),	
			array( "name"=>"You The Designer",			"site"=> "http://www.youthedesigner.com/",		"url"=>"http://feeds.feedburner.com/YouTheDesigner",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name"=>"slodive",					"site"=> "http://slodive.com/",					"url"=>"http://feeds.feedburner.com/slodive",						"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name"=>"Designspiration",			"site"=> "http://designspiration.net/",			"url"=>"http://feeds.feedburner.com/dspn",							"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),			
			array( "name"=>"Abduzeedo",					"site"=> "http://abduzeedo.com/",				"url"=>"http://feeds.feedburner.com/abduzeedo",						"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"Changethethought",			"site"=> "http://www.changethethought.com/",	"url"=>"http://www.changethethought.com/feed/",						"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
		)),
		array( "name"=>"web", 
		"feeds" =>array(		// 웹 디자인 +
			array( "name"=>"Awwwards",					"site"=> "http://www.awwwards.com/",			"url"=>"http://feeds.feedburner.com/awwwards-sites-of-the-day",		"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"Web Design Inspiration",	"site"=> "http://www.webdesign-inspiration.com/", "url"=>"http://feeds.feedburner.com/wdinspi",						"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"site inspire",				"site"=> "http://www.siteinspire.com/",			"url"=>"http://feeds2.feedburner.com/Siteinspire",					"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"Splashnology.com",			"site"=> "http://www.splashnology.com/",		"url"=>"http://feeds.feedburner.com/Splashnology",					"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name"=>"The Best Designs",			"site"=> "http://www.thebestdesigns.com/",		"url"=>"http://feeds.feedburner.com/thebestdesigns",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"design shack",				"site"=> "http://designshack.net/",				"url"=>"http://feeds.designshack.net/designshack",					"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"Ahrefmagazine",				"site"=> "http://www.ahrefmagazine.com/",		"url"=>"http://feeds.feedburner.com/ahrefmag",						"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
		)),
		array( "name"=>"architecture",
		"feeds" =>array(// 건축, 인테리어
			array( "name"=>"Archdaily",					"site"=> "http://www.archdaily.com/",			"url"=>"http://feeds.feedburner.com/ArchDaily",						"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name"=>"Design milk",				"site"=> "http://design-milk.com/",				"url"=>"http://feeds.feedburner.com/design-milk",					"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name"=>"Dezeen",					"site"=> "http://www.dezeen.com/",				"url"=>"http://feeds.feedburner.com/dezeen",						"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"Designboom",				"site"=> "http://www.designboom.com/",			"url"=>"http://www.designboom.com/feed/",							"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"freshome",					"site"=> "http://freshome.com/",				"url"=>"http://feeds.feedburner.com/FreshInspirationForYourHome",	"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name"=>"Design*Sponge",				"site"=> "http://www.designsponge.com/",		"url"=>"http://feeds.feedburner.com/designsponge/njjl",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name"=>"Home Design Find",			"site"=> "http://www.homedesignfind.com/",		"url"=>"http://feeds2.feedburner.com/homedesignfind",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name"=>"Design Inspiration. Planet Stencil Library","site"=> "http://designinspiration.typepad.com/", "url"=>"http://feeds.feedburner.com/typepad/TZkd","loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
		)),
		array( "name"=>"photo", 
		"feeds" =>array( // 사진
			array( "name" => "Photography Blogger",		"site"=> "http://www.photographyblogger.net/",	"url"=>"http://feeds.feedblitz.com/photoblggr",						"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name" => "123 Inspiration",			"site"=> "http://www.123inspiration.com/",		"url"=>"http://feeds.feedburner.com/123inspiration",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name" => "PetaPixel ",				"site"=> "http://petapixel.com/",				"url"=>"http://feeds.feedburner.com/PetaPixel",						"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name" => "121clicks.com ",			"site"=> "http://121clicks.com/",				"url"=>"http://feeds.feedburner.com/121clicks",						"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),	
		)),
		array( "name"=>"fashion", 
		"feeds" =>array( // 패션
			array( "name" => "STYLE DU MONDE",	"site"=> "http://www.styledumonde.com/",				"url"=>"http://www.styledumonde.com/feed/",							"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name" => "Cocorosa",		"site"=> "http://mypreciousconfessions.blogspot.kr/",	"url"=>"http://mypreciousconfessions.blogspot.com/feeds/posts/default?alt=rss",	"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),	
			array( "name" => "The Freelancer's Fashionblog","site"=> "http://freelancersfashion.blogspot.kr/",	"url"=>"http://freelancersfashion.blogspot.kr/feeds/posts/default?alt=rss",		"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),	
			array( "name" => "Trendland",				"site"=> "http://trendland.com/",				"url"=>"http://trendland.com/feed",							"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),	
			array( "name" => "Fashionista",				"site"=> "http://fashionista.com/",				"url"=>"http://fashionista.com/feed/",								"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),	
			array( "name" => "ROKSTYLES",				"site"=> "http://rokstyles.com/",				"url"=>"http://rokstyles.com/feed/",								"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),						
			//이미지가 너무 작음 //array( "name" => "WWD Shows and Reviews",	"site"=> "http://www.wwd.com/",					"url"=>"http://www.wwd.com/rss/2/news/shows-reviews",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),			
			array( "name" => "GQ.com",					"site"=> "http://www.gq.com/",					"url"=>"http://www.gq.com/services/rss/feeds/latest.xml",			"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),			
			array( "name" => "Comme un camion",			"site"=> "http://www.commeuncamion.com/",		"url"=>"http://www.commeuncamion.com/feed/",						"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),	
			array( "name" => "Vogue.com",				"site"=> "http://www.vogue.com/",				"url"=>"http://www.vogue.com/rss/just-in/",							"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),	
			array( "name" => "Fashion in Korea","site"=> "http://fashioninkorea.org/",					"url"=>"http://feeds.feedburner.com/fashioninkorea",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),	
			//너무 느림//array( "name" => "fashiontv",				"site"=> "http://www.fashiontv.com/",			"url"=>"http://www.fashiontv.com/rss/",								"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),			
		)),
		array( "name"=>"logo", 
		"feeds" =>array(// 로고 와 타이포그라피
			array( "name"=>"LogoMoose",					"site"=> "http://www.logomoose.com/",			"url"=>"http://feeds.feedburner.com/logomoose",						"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name"=>"Creattica Logo",			"site"=> "http://creattica.com/",				"url"=>"http://creattica.com/feed/logos",							"loadded"=> false, "feed"=> null, "parsing"=> "atom", "done"=> "doneFeedBurnerEncoded" ),
			array( "name"=>"Logo Design Love",			"site"=> "http://www.logodesignlove.com/",		"url"=>"http://feeds.feedburner.com/logodesignlove",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"Logo Of The Day",			"site"=> "http://logooftheday.com/",			"url"=>"http://feeds.feedburner.com/LogoOfTheDay",					"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name"=>"I Love Typography",			"site"=> "http://ilovetypography.com",			"url"=>"http://feeds.feedburner.com/ILoveTypography",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
		)),
		array( "name"=>"car", 
		"feeds" =>array(// 자동차
			array( "name"=>"Autoblog",					"site"=> "http://www.autoblog.com/",			"url"=>"http://feeds.autoblog.com/weblogsinc/autoblog",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"CNET Car Tech",				"site"=> "http://www.cnet.com/topics/car-tech/","url"=>"http://www.cnet.com/rss/car-tech/",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"Carscoops ",				"site"=> "http://www.carscoops.com/",			"url"=>"http://feeds.feedburner.com/Carscoop",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"Car and Driver Blog ",		"site"=> "http://blog.caranddriver.com/",		"url"=>"http://feeds.feedburner.com/caranddriver/blog",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name"=>"CAR.BLOG.BR - Carros",		"site"=> "http://www.car.blog.br/",		"url"=>"http://feeds.feedburner.com/automotivas",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"Hemmings Daily",		"site"=> "http://blog.hemmings.com/",		"url"=>"http://blog.hemmings.com/index.php/feed/",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
		)),
		array( "name"=>"etc", 
		"feeds" =>array(		// 기타, 샵, 티셔츠, 회사, 산업디자인, 사진과 디자인
			array( "name"=>"threadless",				"site"=> "https://www.threadless.com/",			"url"=>"https://www.threadless.com/feeds/product_releases",			"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"Core77",					"site"=> "http://www.core77.com/",				"url"=>"http://feeds.feedburner.com/core77/blog",					"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"Pokkisamblog",				"site"=> "http://blog.pokkisam.com/",			"url"=>"http://feeds.feedburner.com/Pokkisamblog",					"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
			array( "name"=>"Design daily news",			"site"=> "http://www.designer-daily.com/",		"url"=>"http://feeds.feedburner.com/DailyDesignerNews",				"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBurnerEncoded" ),
			array( "name"=>"Fusioncorp Design™ RSS",	"site"=> "http://www.fusioncorpdesign.com/",	"url"=>"http://www.fusioncorpdesign.com/rss/",						"loadded"=> false, "feed"=> null, "parsing"=> null, "done"=> "doneFeedBunerDesc" ),
		))
	);
	echo json_encode($category);
}else{
	header( 'Location: '. $referer );
}

?>