<?php
// send_email.php

header('Content-Type: application/json');
$arabic = ($_POST['lang'] ?? 'en') === 'ar';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize input data
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $projectType = strip_tags(trim($_POST["project_type"]));
    $message = strip_tags(trim($_POST["message"]));

    // Check for empty fields
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => $arabic ? "يرجى إكمال النموذج والمحاولة مرة أخرى." : "Please complete the form and try again."]);
        exit;
    }

    // Email details
    $recipient = "info@starfacadelighting.com";
    $subject = "New Contact from Star Facade Lighting Website: $name";

    // Email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Project Type: $projectType\n\n";
    $email_content .= "Message:\n$message\n";

    // Email headers
    $email_headers = "From: $name <$email>\r\nContent-Type: text/plain; charset=UTF-8";

    // Send the email
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => $arabic ? "شكراً لك! تم إرسال رسالتك." : "Thank you! Your message has been sent."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $arabic ? "تعذر إرسال رسالتك. يرجى المحاولة مرة أخرى." : "Oops! Something went wrong and we couldn't send your message."]);
    }

} else {
    // Not a POST request
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => $arabic ? "حدثت مشكلة أثناء إرسال الطلب. يرجى المحاولة مرة أخرى." : "There was a problem with your submission, please try again."]);
}
?>
