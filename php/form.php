<?php
if(isset($_POST['g-recaptcha-response'])){
	$msg = "";
	foreach($_POST as $key=>$value){
		if($key=="g-recaptcha-response") continue;
		$msg.="-$key: $value  \r\n";
	}
	//3818test@gmail.com
	if(mail("lro@3818.com.ar", "Contact from Flux site", $msg, "From:info@3818.com.ar")){
		echo "ok";	
	} else header ("HTTP/1.0 404 Not Found");
	/*$fp = fopen("log.txt", "w");
	fwrite($fp, $msg);
	fclose($fp);
	echo "ok";*/
	
} else echo header ("HTTP/1.0 404 Not Found");
//print_r(var_dump($_POST));
?>