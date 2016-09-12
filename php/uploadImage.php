<?php
	$target_dir = "../images/";
	$file =  basename($_FILES["image"]["name"]);
	$target_file = $target_dir . $file;
	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
	$check = getimagesize($_FILES["image"]["tmp_name"]);
	 if($check !== false) {
	 	move_uploaded_file($_FILES["image"]["tmp_name"], $target_file);
	 	//die(var_dump($check));
	 	$res = array("size"=>array($check[0], $check[1]),"url"=>"images/$file");
	 } else $res = array('resultext' => 'error');
	 echo json_encode($res, JSON_UNESCAPED_SLASHES);
?>