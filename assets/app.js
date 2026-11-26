(function () {
  // Número de WhatsApp (formato internacional sin +, ej. 595981123456). Vacío = botón oculto.
  var WHATSAPP = "51966376027";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  $("#y").textContent = new Date().getFullYear();

  // menú móvil
  var menu = $("#menu");
  $("#burger").onclick = function () { menu.classList.toggle("open"); };
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") menu.classList.remove("open"); });

  // WhatsApp
  if (WHATSAPP) {
    var wa = $("#wa");
    wa.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent("Hola InsightPY, quiero una asesoría.");
    wa.classList.add("on");
  }

  // barra de progreso + luz que sigue al mouse
  window.addEventListener("scroll", function () {
    var h = document.documentElement;
    $("#prog").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
  }, { passive: true });
  if (matchMedia("(hover:hover)").matches) {
    window.addEventListener("mousemove", function (e) {
      var g = $("#glow"); g.style.left = e.clientX + "px"; g.style.top = e.clientY + "px";
    });
  }

  // palabra rotativa del título
  var words = ["empresas modernas", "tus procesos", "tus datos", "tu equipo"], wi = 0, rot = $("#rot");
  setInterval(function () {
    rot.style.opacity = 0; rot.style.transform = "translateY(10px)";
    setTimeout(function () {
      wi = (wi + 1) % words.length; rot.textContent = words[wi];
      rot.style.opacity = 1; rot.style.transform = "none";
    }, 350);
  }, 2800);
  rot.style.transition = "opacity .35s, transform .35s";

  // marquesina
  var tags = ["Desarrollo a medida", "Automatización", "Análisis de datos", "Tableros", "Sistemas web", "Integraciones", "Instalación en campo", "Infraestructura", "Soporte continuo", "Asesoría"];
  $("#track").innerHTML = tags.concat(tags, tags, tags).map(function (w) { return "<span>" + w + "</span>"; }).join("");

  // terminal con tipeo
  var lines = [
    '<span class="cm">$</span> insightpy iniciar --a-medida',
    '<span class="ok">✔</span> Analizando tu operación',
    '<span class="ok">✔</span> Automatizando procesos',
    '<span class="ok">✔</span> Tablero publicado'
  ];
  var term = $("#term"), li = 0, shown = [];
  function tick() {
    if (li < lines.length) { shown.push(lines[li++]); } else { shown = []; li = 0; }
    term.innerHTML = shown.join("<br>") + '<br><span class="caret"></span>';
    setTimeout(tick, li === 0 ? 1200 : 900);
  }
  tick();

  // contadores
  function count(root) {
    $$("[data-n]", root).forEach(function (el) {
      var end = +el.dataset.n, st = null;
      requestAnimationFrame(function step(ts) {
        st = st || ts;
        var p = Math.min((ts - st) / 1100, 1);
        el.textContent = Math.round(end * p);
        if (p < 1) requestAnimationFrame(step);
      });
    });
  }
  count(document);

  // tabs de la plataforma
  $$(".tab").forEach(function (b) {
    b.onclick = function () {
      $$(".tab").forEach(function (x) { x.classList.remove("on"); });
      $$(".pane").forEach(function (p) { p.classList.remove("on"); });
      b.classList.add("on"); $("#" + b.dataset.t).classList.add("on");
    };
  });

  // tablero dinámico
  var DATA = {
    7:  { k: [1284, 94, 18], d: ["▲ 12%", "▲ 3 pts", "horas"], bars: [42, 58, 51, 76, 64, 88, 70] },
    30: { k: [5420, 91, 74], d: ["▲ 18%", "▲ 5 pts", "horas"], bars: [55, 48, 62, 70, 66, 82, 91, 77, 84, 95] },
    90: { k: [16380, 89, 210], d: ["▲ 27%", "▲ 8 pts", "horas"], bars: [30, 44, 52, 49, 63, 71, 68, 80, 86, 92, 88, 100] }
  };
  function fmt(n) { return n.toLocaleString("es"); }
  function render(r) {
    var d = DATA[r], c = $("#chart");
    $("#k1").textContent = fmt(d.k[0]); $("#k2").textContent = d.k[1] + "%"; $("#k3").textContent = d.k[2] + " h";
    $("#d1").textContent = d.d[0]; $("#d2").textContent = d.d[1]; $("#d3").textContent = "▲ ahorro";
    c.innerHTML = d.bars.map(function (v) { return '<i style="height:4%" data-h="' + v + '" data-v="' + v + '"></i>'; }).join("");
    setTimeout(function () { $$("i", c).forEach(function (i) { i.style.height = i.dataset.h + "%"; }); }, 40);
  }
  $$("#seg button").forEach(function (b) {
    b.onclick = function () {
      $$("#seg button").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on"); render(b.dataset.r);
    };
  });
  render(7);

  // automatización: ejecutar flujo
  var running = false;
  $("#run").onclick = function () {
    if (running) return; running = true;
    var st = $$(".st"), btn = this;
    btn.textContent = "Ejecutando…";
    st.forEach(function (s) { s.className = "st"; $("i", s).style.width = "0"; $("em", s).textContent = "pendiente"; });
    (function go(i) {
      if (i >= st.length) { running = false; btn.textContent = "↻ Volver a ejecutar"; return; }
      var s = st[i]; s.classList.add("run"); $("em", s).textContent = "en curso";
      setTimeout(function () { $("i", s).style.width = "100%"; }, 30);
      setTimeout(function () { s.className = "st done"; $("em", s).textContent = "✓ listo"; go(i + 1); }, 1000);
    })(0);
  };

  // sistema web: tabla con filtro y búsqueda
  var ROWS = [
    [1042, "Alta de cliente", "Equipo A", "Aprobada", "a"], [1043, "Reporte mensual", "Equipo B", "En revisión", "b"],
    [1044, "Carga masiva de datos", "Equipo A", "Procesando", "c"], [1045, "Cierre semanal", "Equipo C", "Aprobada", "a"],
    [1046, "Nuevo usuario", "Equipo B", "Procesando", "c"], [1047, "Actualización de catálogo", "Equipo C", "En revisión", "b"]
  ];
  var filt = "";
  function table() {
    var q = $("#q").value.toLowerCase();
    $("#tb").innerHTML = ROWS.filter(function (r) {
      return (!filt || r[3] === filt) && (r[1] + " " + r[2]).toLowerCase().indexOf(q) > -1;
    }).map(function (r) {
      return "<tr><td>#" + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + '</td><td><span class="tg ' + r[4] + '">' + r[3] + "</span></td></tr>";
    }).join("") || '<tr><td colspan="4" style="color:#a3aed6">Sin resultados</td></tr>';
  }
  $("#q").oninput = table;
  $$(".chip").forEach(function (c) {
    c.onclick = function () {
      $$(".chip").forEach(function (x) { x.classList.remove("on"); });
      c.classList.add("on"); filt = c.dataset.f; table();
    };
  });
  table();

  // contadores de cifras reales (al entrar en pantalla)
  function countTo(el) {
    var end = +el.dataset.c, st = null;
    requestAnimationFrame(function step(ts) {
      st = st || ts;
      var p = Math.min((ts - st) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    });
  }

  // aparición al hacer scroll
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("in"); io.unobserve(e.target);
        $$("[data-c]", e.target).forEach(countTo);
      }
    });
  }, { threshold: 0.12 });
  $$(".rv").forEach(function (el) { io.observe(el); });

  // productos: demo interactiva del kiosco + panel
  (function () {
    var feed = $("#feed"); if (!feed) return;
    var act = 419, S = { in: 286, lu: 34, out: 12 };
    var Z = [{ n: "Mezzanine", t: 57, p: 38, c: "#8b5cf6" }, { n: "Estantería", t: 23, p: 17, c: "#22d3ee" }, { n: "Knapp", t: 31, p: 21, c: "#34d399" }];
    var names = ["Ana Ríos", "Luis Paredes", "Marta Quispe", "Diego Salas", "Rosa Huamán", "Jorge Vega", "Lucía Torres", "Pedro Mamani", "Carla Díaz", "Iván Rojas", "Elena Cruz", "Mateo León"];
    var cols = ["#8b5cf6", "#22d3ee", "#f472b6", "#fbbf24", "#34d399", "#fb7185"];
    var lab = { in: "Ingreso", lu: "Almuerzo", out: "Salida" };
    var map = { in: "k-in", lu: "k-lu", out: "k-out" };
    function rnd(n) { return Math.floor(Math.random() * n); }
    function hm(off) { var d = new Date(Date.now() - (off || 0) * 60000); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
    function paint(key) {
      $("#k-act").textContent = act;
      ["in", "lu", "out"].forEach(function (k) { $("#" + map[k]).textContent = S[k]; });
      $("#b-in").style.width = Math.round(S.in / act * 100) + "%";
      $("#zones").innerHTML = Z.map(function (z) {
        return '<div style="--c:' + z.c + '"><small>' + z.n + '</small><b>' + z.p + ' <span>/ ' + z.t + '</span></b><u><i style="width:' + Math.round(z.p / z.t * 100) + '%"></i></u></div>';
      }).join("");
      if (key) { var el = $("#" + map[key]); el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
    }
    function row(name, a, time, quiet) {
      var d = document.createElement("div"); d.className = "fr"; if (quiet) d.style.animation = "none";
      var ini = name.split(" ").map(function (w) { return w[0]; }).join("");
      d.style.setProperty("--c", cols[rnd(cols.length)]);
      d.innerHTML = '<span class="av">' + ini + '</span><span class="nm">' + name + '</span><span class="tg ' + a + '">' + lab[a] + '</span><span class="tm">' + time + "</span>";
      feed.insertBefore(d, feed.firstChild);
      while (feed.children.length > 5) feed.removeChild(feed.lastChild);
    }
    function apply(a, name, quiet, time) {
      if (a === "in") { S.in = Math.min(act, S.in + 1); var z = Z[rnd(Z.length)]; if (z.p < z.t) z.p++; }
      else if (a === "lu") { S.lu++; }
      else { S.out++; if (S.lu > 0) S.lu--; }
      row(name, a, time || hm(0), quiet);
      paint(quiet ? null : a);
    }
    [["in", 9], ["lu", 6], ["in", 4], ["out", 2]].forEach(function (e) { row(names[rnd(names.length)], e[0], hm(e[1]), true); });
    paint();

    var face = $("#face"), st = $("#tstate"), busy = false, lastUser = 0, vis = false;
    function mark(a, byUser) {
      if (busy) return; busy = true; if (byUser) lastUser = Date.now();
      var name = names[rnd(names.length)];
      face.className = "face scan"; st.textContent = "Reconociendo rostro…";
      setTimeout(function () {
        face.className = "face ok"; st.innerHTML = "✔ <b>" + name.split(" ")[0] + "</b> · " + lab[a] + " registrada";
        apply(a, name);
      }, 900);
      setTimeout(function () { face.className = "face"; st.textContent = "Toca para marcar"; busy = false; }, 2700);
    }
    $$(".tbtns button").forEach(function (b) { b.onclick = function () { mark(b.dataset.a, true); }; });
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }, { threshold: 0.3 }).observe($("#stage"));
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInterval(function () {
        if (!vis || Date.now() - lastUser < 7000) return;
        var r = Math.random(); mark(r < 0.6 ? "in" : r < 0.8 ? "lu" : "out", false);
      }, 4200);
    }

    // capturas ampliables
    var lb = $("#lb"), lbi = $("img", lb);
    $$(".sh").forEach(function (b) { b.onclick = function () { lbi.src = b.dataset.src; lb.classList.add("on"); }; });
    lb.onclick = function () { lb.classList.remove("on"); };
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.classList.remove("on"); });
  })();

  // formulario
  var form = $("#form"), msg = $("#msg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    msg.className = "msg";
    if (!form.checkValidity()) { msg.className = "msg err"; msg.textContent = "Completa nombre, correo válido y mensaje."; return; }
    var btn = $("button", form);
    btn.disabled = true; btn.textContent = "Enviando…";
    fetch("enviar.php", { method: "POST", body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function (d) { msg.className = "msg " + (d.ok ? "ok" : "err"); msg.textContent = d.msg; if (d.ok) form.reset(); })
      .catch(function () { msg.className = "msg err"; msg.textContent = "No se pudo enviar. Escríbenos a coordinacion@insightpysolutions.com"; })
      .finally(function () { btn.disabled = false; btn.textContent = "Enviar mensaje →"; });
  });
})();
