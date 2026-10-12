<?php
declare(strict_types=1);
ini_set('display_errors', '0');
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('X-Frame-Options: DENY');

$isHttps = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== '' && strtolower((string)$_SERVER['HTTPS']) !== 'off';
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
session_name('MGSSESSID');
session_set_cookie_params([
    'lifetime' => 0, 'path' => '/', 'secure' => $isHttps,
    'httponly' => true, 'samesite' => 'Lax'
]);
session_start();

function contactRespond(array $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
function contactFail(string $message, int $status = 400): never {
    contactRespond(['ok' => false, 'error' => $message], $status);
}
function inputText(mixed $value, int $max): string {
    $value = trim((string)($value ?? ''));
    if (strlen($value) > $max) $value = substr($value, 0, $max);
    return $value;
}

if (strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET')) !== 'POST') {
    header('Allow: POST');
    contactFail('Only POST requests are accepted.', 405);
}
// Reject cross-site use when an Origin header is supplied.
$origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
$host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
if ($origin !== '') {
    $originHost = strtolower((string)(parse_url($origin, PHP_URL_HOST) ?? ''));
    if ($originHost === '' || $host === '' || !hash_equals(preg_replace('/:\d+$/', '', $host), $originHost)) {
        contactFail('The contact request origin could not be verified.', 403);
    }
}
$csrf = (string)($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
if ($csrf === '' || empty($_SESSION['mgs_csrf']) || !hash_equals((string)$_SESSION['mgs_csrf'], $csrf)) {
    contactFail('Your secure contact session expired. Refresh the page and try again.', 419);
}
// Session rate limit; individual hosting/WAF limits should be added if required.
$lastSent = (int)($_SESSION['mgs_contact_last_sent'] ?? 0);
if ($lastSent > 0 && time() - $lastSent < 20) {
    contactFail('Please wait a few seconds before sending another inquiry.', 429);
}
$raw = file_get_contents('php://input');
$data = json_decode($raw === false ? '' : $raw, true);
if (!is_array($data)) contactFail('The contact form submission was invalid.', 400);
// Quiet honeypot catches basic automated submissions.
if (trim((string)($data['website'] ?? '')) !== '') contactRespond(['ok' => true]);
$name = inputText($data['name'] ?? '', 120);
$email = strtolower(inputText($data['email'] ?? '', 254));
$subject = inputText($data['subject'] ?? '', 180);
$message = inputText($data['message'] ?? '', 6000);
if ($name === '' || $subject === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    contactFail('Enter your name, a valid email address, subject and message.', 422);
}
// Never accept user-supplied mail headers; only the message body contains the sender input.
$cleanSubject = preg_replace('/[\r\n]+/', ' ', $subject) ?? 'Website enquiry';
$to = 'info@mercuryglobalsystems.com';
$mailSubject = '[BBZ Website Enquiry] ' . $cleanSubject;
$mailBody = "A new website inquiry was submitted.\n\n" .
    "Name: {$name}\n" .
    "Email: {$email}\n" .
    "Subject: {$cleanSubject}\n\n" .
    "Message:\n{$message}\n\n" .
    "Sent from the BULK BY ZONE website contact form.\n";
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: BULK BY ZONE Website <website@mercuryglobalsystems.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . PHP_VERSION,
];
$encodedSubject = '=?UTF-8?B?' . base64_encode($mailSubject) . '?=';
$sent = @mail($to, $encodedSubject, $mailBody, implode("\r\n", $headers));
if (!$sent) {
    error_log('[MGS contact] PHP mail() failed; review host mail delivery configuration.');
    contactFail('The hosting email service is not configured to send this inquiry yet. Please email info@mercuryglobalsystems.com directly.', 503);
}
$_SESSION['mgs_contact_last_sent'] = time();
contactRespond(['ok' => true, 'message' => 'Your inquiry has been sent.']);
