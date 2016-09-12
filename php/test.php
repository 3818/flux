<?php

$a = "La casa de mi abuela";
$b = "Zu";
$pos = strpos($a, $b);
if($pos === false) echo "No encuentra";
else echo "Encuentra $pos";
?>