<?php
header('Content-Type: application/json');

// Get the posted data.
$post_data = file_get_contents('php://input');
$data = json_decode($post_data);

// Basic validation.
if (!isset($data->email) || !filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

if (!isset($data->score) || !isset($data->breakdown)) {
    echo json_encode(['success' => false, 'message' => 'Score data is missing.']);
    exit;
}

$to = $data->email;
$subject = 'Your CRS Score Calculation Results';

// Email headers.
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= 'From: <no-reply@crscalculator.com>' . "\r\n"; // Replace with a valid from address

// Email body (HTML).
$message = "
<html>
<head>
    <title>Your CRS Score Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { width: 100%; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        h1 { color: #FF6600; }
        h2 { border-bottom: 1px solid #eee; padding-bottom: 10px; }
        p { margin: 5px 0; }
        strong { color: #FF6600; }
    </style>
</head>
<body>
    <div class='container'>
        <h1>CRS Score Report</h1>
        <h2>Total Score: " . htmlspecialchars($data->score) . "</h2>
        <h3>Score Breakdown:</h3>
        <p><strong>Core Human Capital:</strong> " . htmlspecialchars($data->breakdown->core) . "</p>
        <p><strong>Spouse Factors:</strong> " . htmlspecialchars($data->breakdown->spouse) . "</p>
        <p><strong>Skill Transferability:</strong> " . htmlspecialchars($data->breakdown->skill) . "</p>
        <p><strong>Additional Points:</strong> " . htmlspecialchars($data->breakdown->additional) . "</p>
        <hr>
        <p>This is an automated email. Please do not reply.</p>
    </div>
</body>
</html>
";

// Send the email.
if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Email sent successfully!']);
} else {
    // Note: mail() can fail for many server configuration reasons.
    // This error message is for the client-side, the server logs would have more details.
    echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again later.']);
}
?>
