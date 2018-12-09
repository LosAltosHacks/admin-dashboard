<?php

$servername = "localhost";
$username = "root";
$password = "mml8linmc";
$dbname = "smash";

require($_SERVER['DOCUMENT_ROOT'] . '/phpmailer/PHPMailerAutoload.php');
$mail = new \PHPMailer;

$mail->isSMTP();
// $mail->SMTPDebug = 2;
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->IsHTML(true);
$mail->Username = 'lahs.outreach@gmail.com';
$mail->Password = 'lahsoutreach';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;
$mail->setFrom('lahs.outreach@gmail.com', 'SFGHS Outreach Team');

 ?>
