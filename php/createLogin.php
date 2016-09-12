<?php
	$user = isset($_POST['user'])?$_POST['user']:"admin";
	$pass = isset($_POST['pass'])?$_POST['pass']:"admin";
	file_put_contents("users.txt", md5($user."/".$pass));
?>
