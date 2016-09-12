<?php
/**
* POST have a serie of HTML snippets
* identified by key
*/
error_reporting(E_ALL);
require_once 'phpQuery-onefile.php';
 if (sizeof($_POST) >1) {
 	//get posted data
	$tmp =  explode("/", $_SERVER['HTTP_REFERER']);
	$tmpfile = explode("?", $tmp[sizeof($tmp)-1])[0];
	$file = realpath("../".$tmpfile);
	//if there's no original file return
	if(!is_file($file)) return json_encode(false);
	//load and parse the HTML of the original file
	$html = file_get_contents($file);
	$dom = phpQuery::newDocumentHTML($html);
	//replace div content by id
	$fields = json_decode($_POST['regions']);
	foreach ($fields as  $key => $value) {
		pq("div[id='".$key."']")->html($value);
	}
	$bytes = file_put_contents($file, $dom);
	if($bytes>0) echo json_encode(true);
 }
 ?>