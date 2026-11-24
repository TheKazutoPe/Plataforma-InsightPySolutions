(function () {
  var $ = function (s) { return document.querySelector(s); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hero = $(".hero"), vis = $(".vis");
  if (!hero || !vis) return;

  var onScreen = true;
  new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; }, { threshold: 0 }).observe(hero);

  /* ---------- gráfico en vivo que se desplaza ---------- */
  var N = 16, step = 400 / (N - 3), pts = [], t = 0, last = 0;
  var v = 55;
  function nextVal() { v += (Math.random() - 0.42) * 26; v = Math.max(18, Math.min(92, v)); return v; }
  for (var i = 0; i < N; i++) pts.push(nextVal());
  var lf = $("#lf"), ll = $("#ll"), dot = $("#ldot");
  function y(val) { return 104 - val * 0.92; }
  function draw() {
    var d = "";
    for (var i = 0; i < N; i++) {
      var x = (i - 1 - t) * step, yy = y(pts[i]);
      if (i === 0) d += "M" + x.toFixed(1) + " " + yy.toFixed(1);
      else {
        var px = (i - 2 - t) * step, py = y(pts[i - 1]), mx = (px + x) / 2;
        d += " C" + mx.toFixed(1) + " " + py.toFixed(1) + " " + mx.toFixed(1) + " " + yy.toFixed(1) + " " + x.toFixed(1) + " " + yy.toFixed(1);
      }
    }
    ll.setAttribute("d", d);
    lf.setAttribute("d", d + " L" + ((N - 2 - t) * step + step).toFixed(1) + " 110 L" + (-step) + " 110 Z");
    var dx = (N - 3 - t) * step, dy = y(pts[N - 2]);
    dot.style.left = (dx / 400 * 100) + "%"; dot.style.top = (dy / 110 * 100) + "%";
  }
  draw();

  /* ---------- números, medidor y avisos ---------- */
  var kpi = $("#kpi"), kv = 28;
  function tween(el, from, to, ms, fmt) {
    var s = null;
    requestAnimationFrame(function f(ts) {
      s = s || ts; var p = Math.min((ts - s) / ms, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt ? fmt(from + (to - from) * e) : Math.round(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(f);
    });
  }
  var gar = $("#gar"), gnum = $("#gnum"), gv = 0;
  function gauge(target) {
    gar.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)";
    gar.style.strokeDashoffset = 213.6 * (1 - target / 100);
    tween(gnum, gv, target, 1400); gv = target;
  }
  setTimeout(function () { gauge(94); }, 500);

  var toastMsgs = [
    ["⚡", "Proceso automatizado", "Reporte enviado · demo"],
    ["📊", "Tablero actualizado", "Datos al día · demo"],
    ["✅", "Carga completada", "1 284 registros · demo"],
    ["📩", "Alerta enviada", "Supervisor notificado · demo"]
  ], ti = 0, toast = $("#toast");
  var notes = ["Nueva solicitud #1048", "Reporte listo para revisión", "Equipo conectado", "Meta diaria alcanzada"], ni = 0, note = $("#note");

  if (!reduce) {
    // bucle de animación del gráfico
    (function loop(ts) {
      if (onScreen) {
        var dt = last ? Math.min(ts - last, 60) : 16; last = ts;
        t += dt / 1100;
        if (t >= 1) { t -= 1; pts.shift(); pts.push(nextVal()); }
        draw();
      } else last = 0;
      requestAnimationFrame(loop);
    })(0);

    setInterval(function () {
      if (!onScreen) return;
      var to = 22 + Math.floor(Math.random() * 18);
      tween(kpi, kv, to, 900); kv = to;
      $("#kup").textContent = (to >= 28 ? "▲ " : "▼ ") + "en vivo · demo";
      $("#kup").style.color = to >= 28 ? "#34d399" : "#fbbf24";
    }, 2600);

    setInterval(function () { if (onScreen) gauge(86 + Math.floor(Math.random() * 13)); }, 4200);

    setInterval(function () {
      if (!onScreen) return;
      toast.classList.add("swap");
      setTimeout(function () {
        ti = (ti + 1) % toastMsgs.length;
        $("#tico").textContent = toastMsgs[ti][0]; $("#toast-t").textContent = toastMsgs[ti][1]; $("#toast-s").textContent = toastMsgs[ti][2];
        toast.classList.remove("swap");
      }, 350);
    }, 3400);

    setInterval(function () {
      if (!onScreen) return;
      $("#notet").textContent = notes[ni++ % notes.length];
      note.classList.add("show");
      setTimeout(function () { note.classList.remove("show"); }, 2600);
    }, 5200);
    setTimeout(function () { note.classList.add("show"); setTimeout(function () { note.classList.remove("show"); }, 2400); }, 1800);

    /* ---------- partículas flotantes ---------- */
    for (var p = 0; p < 18; p++) {
      var s = document.createElement("span");
      s.className = "pt";
      var size = 3 + Math.random() * 5;
      s.style.cssText = "left:" + (Math.random() * 100) + "%;width:" + size + "px;height:" + size + "px;animation-duration:" + (8 + Math.random() * 10) + "s;animation-delay:-" + (Math.random() * 12) + "s;background:" + ["#22d3ee", "#8b5cf6", "#f472b6", "#fbbf24"][p % 4];
      hero.appendChild(s);
    }

    /* ---------- profundidad con el mouse ---------- */
    if (matchMedia("(hover:hover)").matches) {
      var wins = vis.querySelectorAll(".win"), depth = [10, 18, 26, 14, 22];
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect(),
          dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
        wins.forEach(function (w, i) {
          var k = depth[i % depth.length];
          w.style.translate = (-dx * k).toFixed(1) + "px " + (-dy * k).toFixed(1) + "px";
        });
      });
      hero.addEventListener("mouseleave", function () { wins.forEach(function (w) { w.style.translate = "0 0"; }); });
    }
  } else {
    gauge(94);
  }
})();
