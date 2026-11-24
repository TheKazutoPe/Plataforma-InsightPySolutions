(function () {
  // Número de WhatsApp (formato internacional sin +, ej. 595981123456). Vacío = botón oculto.
  var WHATSAPP = "";

  document.getElementById("y").textContent = new Date().getFullYear();

  // menú móvil
  var menu = document.getElementById("menu");
  document.getElementById("burger").onclick = function () { menu.classList.toggle("open"); };
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") menu.classList.remove("open"); });

  // WhatsApp
  if (WHATSAPP) {
    var wa = document.getElementById("wa");
    wa.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent("Hola InsightPY, quiero una asesoría.");
    wa.classList.add("on");
  }

  // ticker
  var words = ["Desarrollo a medida", "Automatización", "Análisis de datos", "Tableros BI", "Sistemas web", "Integraciones", "Soporte continuo", "Asesoría tecnológica"];
  var track = document.getElementById("track");
  track.innerHTML = words.concat(words).concat(words).concat(words).map(function (w) { return "<span>" + w + "</span>"; }).join("");

  // feed en vivo (demo)
  var events = ["Reporte diario generado", "Carga de datos completada", "Alerta enviada al supervisor", "Tablero actualizado", "Proceso automatizado ejecutado", "Nuevo registro validado", "Respaldo realizado"];
  var feed = document.getElementById("feed"), i = 0;
  function push() {
    var li = document.createElement("li");
    var t = new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
    li.innerHTML = "<div>✅ " + events[i++ % events.length] + "</div><span>" + t + "</span>";
    feed.insertBefore(li, feed.firstChild);
    while (feed.children.length > 5) feed.removeChild(feed.lastChild);
  }
  for (var k = 0; k < 4; k++) push();
  setInterval(push, 2600);

  // tabs
  var tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (b) {
    b.onclick = function () {
      tabs.forEach(function (x) { x.classList.remove("on"); });
      document.querySelectorAll(".pane").forEach(function (p) { p.classList.remove("on"); });
      b.classList.add("on");
      var pane = document.getElementById(b.dataset.t);
      pane.classList.add("on");
      count(pane);
    };
  });

  // contadores
  function count(root) {
    root.querySelectorAll("[data-n]").forEach(function (el) {
      var end = +el.dataset.n, s = el.dataset.s || "", st = null;
      (function step(ts) {
        st = st || ts;
        var p = Math.min((ts - st) / 900, 1);
        el.textContent = Math.round(end * p) + s;
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }
  count(document.getElementById("a"));

  // reveal al hacer scroll
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });

  // brillo que sigue al mouse en tarjetas
  document.querySelectorAll(".card").forEach(function (c) {
    c.addEventListener("mousemove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // formulario
  var form = document.getElementById("form"), msg = document.getElementById("msg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    msg.className = "msg";
    if (!form.checkValidity()) { msg.className = "msg err"; msg.textContent = "Completa nombre, correo válido y mensaje."; return; }
    var btn = form.querySelector("button");
    btn.disabled = true; btn.textContent = "Enviando…";
    fetch("enviar.php", { method: "POST", body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        msg.className = "msg " + (d.ok ? "ok" : "err");
        msg.textContent = d.msg;
        if (d.ok) form.reset();
      })
      .catch(function () { msg.className = "msg err"; msg.textContent = "No se pudo enviar. Escríbenos a coordinacion@insightpysolutions.com"; })
      .finally(function () { btn.disabled = false; btn.textContent = "Enviar mensaje"; });
  });
})();
