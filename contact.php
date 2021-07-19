<?php

if(isset($_POST["submit"])) {
    $name = $_POST["name"];
    $mailFrom = $_POST["email"];
    $subject = "New Message from " .$name;
    $text = $_POST["message"];
    $mailTo = "danielgiustiniperez@gmail.com";
    $message = "New Message from Portfolio Visitor: \n\nName: ".$name."\nEmail: ".$mailFrom."\n\nMessage:\n".$text;
    $headers = "From: ".$mailFrom;
    mail($mailTo, $subject, $message, $headers);
    header("Location: /");
}
?>