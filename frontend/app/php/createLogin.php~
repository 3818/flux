<?php
	$user = isset($_POST['user'])?$_POST['user']:"flux";
	$pass = isset($_POST['pass'])?$_POST['pass']:"fluxeditor";
	file_put_contents("users.txt", md5($user."/".$pass));
?>
