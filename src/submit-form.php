<?php
$firstName = htmlspecialchars($_POST['firstName'] ?? '');
$lastName = htmlspecialchars($_POST['lastName'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$phone = htmlspecialchars($_POST['phone'] ?? '');
$message = htmlspecialchars($_POST['message'] ?? '');

if (!$firstName || !$lastName || !$email || !$message) {
    echo "Please fill all required fields.";
    exit;
}

$to = "your_email@gmail.com"; // Your receiving email
$subject = "New Contact Form Submission";
$body = "You received a message from $firstName $lastName\n\n".
        "Email: $email\n".
        "Phone: $phone\n\n".
        "Message:\n$message";

$headers = "From: $email\r\nReply-To: $email\r\n";

if (mail($to, $subject, $body, $headers)) {
    echo "Thank you, $firstName. Your message has been sent.";
} else {
    echo "Mail sending failed. Please check your server/mail config.";
}
?>
