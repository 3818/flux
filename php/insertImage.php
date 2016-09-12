<?php
	error_reporting(E_ERROR | E_WARNING | E_PARSE);
	$file = "../".$_POST['url']; //i.e images/house.jpg
	$crop = $_POST['crop']; //i.e 0.11875,0.077,0.815625,0.85225 (full es 0,0,1,1)
	$tmp = split("/", $file);
	$filename = $tmp[sizeof($tmp)-1];
	$dim = getimagesize($file);
	$resizePerc =($_POST['width']>$dim[0])?1:round($_POST['width'] / $dim[0], 2); 
	//$dest_image = 'images/page_$file'; // make sure the directory is writeable	
	$im = imagecreatefromjpeg($file);
	$finalFile = "../images/final_$filename";
	//if crop, do first then resize
	if($resizePerc<.95){
		$newWidth = $_POST['width'];
		$newHeight = $dim[1]*$resizePerc;
		$resample = imagecreatetruecolor($newWidth, $newHeight);
		imagecopyresampled($resample, $im, 0, 0, 0, 0, $newWidth, $newHeight, $dim[0], $dim[1]);
		imagejpeg ($resample, $finalFile);
	}
	//resize to width if different than 100
	if($crop != "0,0,1,1"){
		//convert arrays to variables
		$points = split("," , $crop);
		$initY = round($points[0], 2);
		$initX = round($points[1], 2);
		$endY = round($points[2], 2);
		$endX = round($points[3], 2);
		$width = $dim[0];
		$height = $dim[1];
		//calculate 4 points
		$baseX = $initX * $width;
		$baseY = $initY * $height;
		$finalX = $endX * $width;
		$finalY = $endY * $height;
		$cropWidth = $finalX - $baseX;
		$cropHeigth = $finalY  - $baseY;
		$fp = fopen("log.txt", "w");
		//fwrite($fp, "($finalX * $width) - $baseX\n");
		fwrite($fp, '('.$width.'/'.$height.') x: '.$baseX.' y: '.$baseY.' width: '.$cropWidth.' height: '.$cropHeigth);
		fclose($fp);
		$to_crop_array = array('x' =>$baseX , 'y' => $baseY, 'width' => $cropWidth, 'height'=> $cropHeigth);
		$dest_image = imagecrop($im, $to_crop_array);
		imagejpeg($dest_image, $finalFile);
	}
	 
	//return new image data
	$dim2 = getimagesize($finalFile);
	$data = array("url"=>substr($finalFile, 3), "size"=>array($dim2[0], $dim2[1]), "alt"=>"thumb", 'data-ce-max-width'=>$dim[0]);
	echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);	
?>