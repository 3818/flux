<?php
 if(!isset($_GET['origin']) || !isset($_GET['file'])) die('Falta parámetros');
 $original = $_GET['origin'];
 $edited = $_GET['file'];
 //restore edited file to non enditable status
 $lines = file($edited);
$z = 0;
 foreach($lines as $line)
{
	//echo $line;
	if(strpos($line, 'css/styles')){
		//echo("<hr>Cambiado styles<hr>");
		$lines[$z] = '<link rel="stylesheet" href="css/styles.css">
		';
	}
	if(strpos($line, 'editable.js')){
		$line ='<!-- <script language="javascript" src="js/editable.js"></script> -->';
		$lines[$z] = $line."
		";
	}
	if(strpos($line, 'gotop')){
		//echo("<hr>gotop<hr>");
		$lines[$z] ='<body id="gotop">
		';
	}
	$z++;
}
 file_put_contents($original, $lines);
 $hash = explode("_", $edited)[0];
 unlink($edited);
 //header("Location:pages.php");
?>
