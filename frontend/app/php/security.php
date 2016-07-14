<?php
	session_start();
	//yet logged
	if(!isset($_POST['user']) || !isset($_POST['pass'])) {
		if(!isset($_SESSION['userId'])) {
			header("Location: ../index.html");
			exit();
		}
	} else { //login
		$hash = md5($_POST['user']."/".$_POST['pass']);
		$data = file_get_contents("users.txt");
		if($hash!=$data){
			header("Location: ../index.html#admin?error");
			exit();	
		} else { //store in session
			$_SESSION['userId'] = $hash;
		}
	}
?>
