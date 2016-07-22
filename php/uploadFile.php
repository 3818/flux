<?php
	$target_dir = "../images/";
	$target_file = $target_dir . basename($_FILES["image"]["name"]);
	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
	$check = getimagesize($_FILES["image"]["tmp_name"]);
	 if($check !== false) {
	 	move_uploaded_file($_FILES["image"]["tmp_name"], $target_file);
	 	echo "ok";
	 } else echo "Error"
?>