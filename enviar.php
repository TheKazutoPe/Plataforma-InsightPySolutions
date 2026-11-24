<?php
header('Content-Type: application/json; charset=utf-8');

function out($ok, $msg) { echo json_encode(['ok' => $ok, 'msg' => $msg], JSON_UNESCAPED_UNICODE); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(false, 'Método no permitido.');
if (!empty($_POST['web'])) out(true, 'Gracias.'); // honeypot anti-spam

$clean = function ($k, $max) { return mb_substr(trim(strip_tags($_POST[$k] ?? '')), 0, $max); };
$nombre   = $clean('nombre', 100);
$empresa  = $clean('empresa', 120);
$telefono = $clean('telefono', 40);
$servicio = $clean('servicio', 80);
$mensaje  = $clean('mensaje', 3000);
$email    = trim($_POST['email'] ?? '');

if ($nombre === '' || $mensaje === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    out(false, 'Revisa los datos ingresados.');
}

$to = 'coordinacion@insightpysolutions.com';
$subject = 'Nuevo contacto web - ' . str_replace(["\r", "\n"], ' ', $nombre);
$body = "Nombre: $nombre\nEmpresa: $empresa\nCorreo: $email\nTeléfono: $telefono\nServicio: $servicio\n\n$mensaje";
$headers = "From: no-reply@insightpysolutions.com\r\n"
         . 'Reply-To: ' . str_replace(["\r", "\n"], '', $email) . "\r\n"
         . "Content-Type: text/plain; charset=UTF-8";

if (@mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers)) {
    out(true, '¡Gracias! Recibimos tu mensaje y te responderemos pronto.');
}
out(false, 'No pudimos enviar el mensaje. Escríbenos a coordinacion@insightpysolutions.com');
