<?php
/*
	Inspiration Browser

	http://inspirationbrowser.com
	https://github.com/Yeonil/InspirationBrowser
	
	제작 및 배포: 훠닐(http://hornil.com)
*/
/*
	단순히 외부 웹사이트를 읽어들여서 그대로 출력한다.
	file_get_contents 함수를 사용하기 위해선 .htaccess에 다음 옵션이 추가되어야 한다. PHP_FLAG allow_url_fopen ON 
*/
if ($_SERVER['REQUEST_METHOD'] === 'POST'){
	if($_POST["url"] == ''){
		echo '';
		exit;	
	}
	$content = file_get_contents($_POST["url"]);
	echo $content ? $content : '';
}else{
	header( 'Location: '. $referer );
}
?>