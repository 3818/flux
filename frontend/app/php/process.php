<?php
	error_reporting(E_ALL ^ E_NOTICE);
	include("security.php");
	//Check restore in first place
	if(isset($_POST['Restore'])){
		//die(var_dump($_POST));
		unlink("../index.html");
		copy("../indexOrig.html", "../index.html");
		header("Location:../index.html");
		//die("Nada ha pasado");
		exit();
	};

	$tmpfile = getReferrer();
	$match = !isset($_POST['edit']);
	if($match){
		$file = $tmpfile;
		$todelete =  "../".md5($tmpfile).".html";
		copy($todelete, $file);
		//rename($todelete, $file);
	} else {
		$file = "../".md5($tmpfile).".html"; //temporal file to work on
		copy($tmpfile, $file);
	}

	$lines = file($file);
	$exp = ($match)?'<!-- editor js -->':'<!-- editor js --><script src="js/editor.js"></script>';
	$toReplace = ($exp=='<!-- editor js --><script src="js/editor.js"></script>')?'<!-- editor js -->':'<!-- editor js --><script src="js/editor.js"></script>';
	//die("Match ? ".$match." <br> exp ".$exp." <br>toReplace ".$toReplace);
	$newlines = replace($lines, $toReplace, $exp);
	$exp = ($match)?'<div id="save_layer" class="fx-editor js-fx-editor">':'<div id="save_layer" class="fx-editor js-fx-editor is-editing">';
	$toReplace = ($exp=='<div id="save_layer" class="fx-editor js-fx-editor is-editing">')?'<div id="save_layer" class="fx-editor js-fx-editor">':'<div id="save_layer" class="fx-editor js-fx-editor is-editing">';
	$newlines2 = replace($newlines, $toReplace, $exp);
	file_put_contents($file, $newlines2);
	//if(isset($todelete)) unlink($todelete); //delete temporal file
	if($file=='../index.html') $file .='#admin?trigger';
	$togo = $file;
	//if export prompt to download the file
	if(isset($_POST['Export'])){
		//clean files from unneded stuff
		$lines = file("../index.html");
		//$toRemove[] = 'link rel="stylesheet" href="css/raptor-front-end.min.css"';
		$toRemove[] = 'script language="javascript" src="js/content-tools.min.js"';
		$toRemove[] = 'script language="javascript" src="js/editor.js"';
		$newlines2 = removeBlock('<!-- init login form -->', '<!-- end login form -->', $lines);
		$newlines3 = removeBlock('<!-- click to edit -->', '<!-- end click to edit -->', $newlines2); //??????????
		$newlines = removeLines($toRemove, $newlines3);
		//add doctype that is omitted by the parser
		array_unshift($newlines, '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">');
		file_put_contents("../indexTmp.html", $newlines);
		//create zip
		if(is_file('../flux.zip')) unlink('../flux.zip');
		// Initialize archive object
		$zip = new ZipArchive();
		$zip->open('../flux.zip', ZipArchive::CREATE);
		//use a temporary file to not overwrite index in use
		$zip->addFile('../indexTmp.html', "index.html");
		$folders = array("css", "fonts", "img", "js");
		$skip = array("indexOrig.html", "editor.js", "content-tools.js", ".", "..", "");
		for($i = 0; $i<sizeof($folders); $i++){
			//echo "On $folders[$i]<br>";
			$files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator("../".$folders[$i]),
			RecursiveIteratorIterator::LEAVES_ONLY);
			foreach ($files as $name => $file){
				$tmp = explode("\\", $file);
				$fileName = $tmp[sizeof($tmp)-1];
				if(array_search($fileName, $skip)) continue;
				$filePath = $file->getRealPath();
				$filetoadd = substr($filePath, strpos($filePath, $folders[$i]));
				if(!is_file("../$filetoadd")) continue;
				//echo "$ext - Agrego: $filePath   COMO   $filetoadd<br>";
				$zip->addFile($filePath,  $filetoadd);
			}
		}
		$zip->close();
		unlink(realpath('../indexTmp.html'));
		header('Content-Description: File Transfer');
		header('Content-Type: application/octet-stream');
		header("Content-disposition: attachment; filename=flux.zip");
		header("Content-length: " . filesize("../flux.zip"));
		header("Pragma: no-cache");
		header("Expires: 0");
		readfile("../flux.zip");
		exit;
	} else header("Location: $togo");

	function replace($lines, $key, $replacement){
		$z = 0;
		foreach($lines as $line)
		{
			if(strpos($line, $key)!== false){
				$lines[$z] = str_replace($key, $replacement."\n" , $line);
				//echo "Key es $key<br>Replacement es $replacement<br>";
				//die("Reemplazando $z es $lines[$z] !!");
				break;
			}
			$z++;
		}
		return $lines;
	}

	function getReferrer(){
		$tmpFile = explode("?", $_SERVER['HTTP_REFERER'])[0];
		$file = '../'.substr($tmpFile, strrpos($tmpFile, "/")+1);
		if(strlen($file<4)) $file = "../index.html";
		return $file;
	}
	//removes a portion of code, one block at the time
	function removeBlock($from, $to, $lines){
		$tot = sizeof($lines);
		$del = false;
		for($i=0; $i<$tot; $i++){
			$line = $lines[$i];
			if(strpos($line, $from) !== false && !$del) $del = true; //begins delete
			if($del) $lines[$i] = "";
			if(strpos($line, $to) !== false && $del) break; //ends delete
		}
		return $lines;
	}

	//removes a portion of code, one block at the time
	function removeLines($arrayContent, $lines){
		$tot = sizeof($lines);
		//walk lines
		for($i=0; $i<$tot; $i++){
			//walk replacements until it's done
			$totToReplace = sizeof($arrayContent);
			for($z=0; $z<$totToReplace; $z++){
				//echo "Busco  $arrayContent[$z] en <pre>$lines[$i]</pre><br>";
				if(strpos($lines[$i], $arrayContent[$z])>=0) {
					//echo "Encuentro y BORRO<br>";
					array_splice($lines, $i, 1);
					array_splice($arrayContent, $z, 1);
					if(sizeof($arrayContent)==0) break;
				}
			}
		}
		return $lines;
	}
?>
