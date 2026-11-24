# InsightPY Solutions - Sitio web

Sitio corporativo en HTML/CSS/JS + PHP (formulario de contacto).

## Estructura
- `index.html` - pagina unica (servicios, plataforma, proceso, nosotros, FAQ, contacto)
- `assets/` - estilos, JS, logos
- `enviar.php` - recibe el formulario y envia correo

## Configuracion
- WhatsApp: editar `WHATSAPP` en `assets/app.js` (formato 595981123456).
- Correo destino: variable `$to` en `enviar.php`.

## Despliegue (Hostinger)
hPanel > Sitios web > PHP/HTML > Desplegar desde Git, repositorio de GitHub, rama `main`.
