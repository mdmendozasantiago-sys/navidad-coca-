// ===== Guirnalda de luces del menú =====
const luces = document.querySelector(".luces");
const coloresFoco = ["#ffd54a", "#ffffff", "#5fe08a", "#ff3b3b"];
const cantidadFocos = Math.round(window.innerWidth / 38);
for (let i = 0; i < cantidadFocos; i++) {
  const foco = document.createElement("span");
  foco.className = "foco";
  const color = coloresFoco[i % coloresFoco.length];
  foco.style.background = color;
  foco.style.color = color;
  foco.style.animationDelay = `${(i % 5) * 0.3}s`;
  luces.appendChild(foco);
}

// ===== Menú hamburguesa (celular) =====
const hamburguesa = document.getElementById("hamburguesa");
const enlaces = document.getElementById("enlaces");
hamburguesa.addEventListener("click", () => {
  const abierto = enlaces.classList.toggle("abierto");
  hamburguesa.classList.toggle("abierto", abierto);
  hamburguesa.setAttribute("aria-expanded", abierto);
  hamburguesa.innerHTML = abierto ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
enlaces.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    if (enlaces.classList.contains("abierto")) hamburguesa.click();
  })
);

// ===== Marcar la sección activa en el menú =====
const secciones = ["inicio", "productos", "navidad", "comparte", "recetas"].map((id) => document.getElementById(id));
const observadorMenu = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        enlaces.querySelectorAll("a").forEach((a) => a.classList.toggle("activo", a.getAttribute("href") === `#${e.target.id}` && !a.classList.contains("boton")));
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
secciones.forEach((s) => observadorMenu.observe(s));

// ===== Animación al hacer scroll =====
const observadorAparecer = new IntersectionObserver(
  (entradas) => entradas.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
  { threshold: 0.15 }
);
document.querySelectorAll(".aparecer").forEach((el) => observadorAparecer.observe(el));

// ===== Cuenta regresiva a Navidad =====
function actualizarContador() {
  const ahora = new Date();
  let navidad = new Date(ahora.getFullYear(), 11, 24, 0, 0, 0);
  if (ahora > new Date(ahora.getFullYear(), 11, 26)) navidad = new Date(ahora.getFullYear() + 1, 11, 24);
  const diferencia = Math.max(0, navidad - ahora);
  const dos = (n) => String(n).padStart(2, "0");
  document.getElementById("dias").textContent = dos(Math.floor(diferencia / 86400000));
  document.getElementById("horas").textContent = dos(Math.floor((diferencia / 3600000) % 24));
  document.getElementById("minutos").textContent = dos(Math.floor((diferencia / 60000) % 60));
  document.getElementById("segundos").textContent = dos(Math.floor((diferencia / 1000) % 60));
}
actualizarContador();
setInterval(actualizarContador, 1000);

// ===== Comparte: vista previa en vivo =====
const nombre = document.getElementById("nombre");
const mensaje = document.getElementById("mensaje");
const vistaPrevia = document.getElementById("vistaPrevia");
const vpNombre = document.getElementById("vpNombre");
const vpMensaje = document.getElementById("vpMensaje");
const compartirWa = document.getElementById("compartirWa");

function actualizarVista() {
  vpNombre.textContent = `Para: ${nombre.value.trim() || "…"}`;
  vpMensaje.textContent = mensaje.value.trim() || "Escribe tu mensaje";
  const texto = `${vpNombre.textContent} — ${vpMensaje.textContent} 🎄🥤`;
  compartirWa.href = `https://wa.me/?text=${encodeURIComponent(texto)}`;
}
nombre.addEventListener("input", actualizarVista);
mensaje.addEventListener("input", actualizarVista);
document.querySelectorAll('input[name="color"]').forEach((radio) =>
  radio.addEventListener("change", () => {
    vistaPrevia.classList.remove("negro", "plata");
    if (radio.value !== "rojo") vistaPrevia.classList.add(radio.value);
  })
);
document.getElementById("formLata").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("avisoLata").textContent = `¡Listo! Tu lata para ${nombre.value.trim()} está creada. Compártela por WhatsApp 🎁`;
});
actualizarVista();

// ===== Newsletter (demostración: no envía datos) =====
document.getElementById("formNews").addEventListener("submit", (e) => {
  e.preventDefault();
  const correo = document.getElementById("correo").value.trim();
  const acepto = document.getElementById("acepto").checked;
  const aviso = document.getElementById("avisoNews");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    aviso.textContent = "Escribe un correo válido.";
  } else if (!acepto) {
    aviso.textContent = "Marca la casilla de privacidad para continuar.";
  } else {
    aviso.textContent = "¡Gracias! Te avisaremos de las sorpresas navideñas ✨";
    e.target.reset();
  }
});

// ===== Nieve cayendo =====
const lienzo = document.getElementById("nieve");
const ctx = lienzo.getContext("2d");
let copos = [];
function ajustarLienzo() {
  lienzo.width = window.innerWidth;
  lienzo.height = window.innerHeight;
  const total = Math.min(120, Math.round(window.innerWidth / 12));
  copos = Array.from({ length: total }, () => ({
    x: Math.random() * lienzo.width,
    y: Math.random() * lienzo.height,
    r: 1 + Math.random() * 3,
    v: 0.4 + Math.random() * 1.1,
    d: Math.random() * Math.PI * 2,
  }));
}
function nevar() {
  ctx.clearRect(0, 0, lienzo.width, lienzo.height);
  ctx.fillStyle = "rgba(255,255,255,.85)";
  ctx.beginPath();
  for (const c of copos) {
    c.y += c.v;
    c.d += 0.01;
    c.x += Math.sin(c.d) * 0.5;
    if (c.y > lienzo.height) { c.y = -5; c.x = Math.random() * lienzo.width; }
    ctx.moveTo(c.x, c.y);
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
  }
  ctx.fill();
  requestAnimationFrame(nevar);
}
window.addEventListener("resize", ajustarLienzo);
ajustarLienzo();
nevar();
