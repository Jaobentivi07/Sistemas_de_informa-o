/* =========================================================
   SEGURANÇA.EXE – interações
   1) Menu móvel  2) Efeito de digitação  3) Linha do tempo
   4) Checklist com barra de progresso  5) Aparição ao rolar
   ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 1) Menu para celulares ------------------------------------ */
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
// Fecha o menu ao escolher um link
menu.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

/* 2) Efeito de digitação no terminal ------------------------ */
const typing = document.getElementById("typing");
if (!reduceMotion) {
  const text = typing.dataset.text;
  typing.setAttribute("aria-label", text); // leitores de tela leem o texto completo
  typing.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    typing.textContent = text.slice(0, ++i);
    if (i >= text.length) clearInterval(timer);
  }, 45);
}

/* 3) Linha do tempo (abas acessíveis) ----------------------- */
const tabs = [...document.querySelectorAll('[role="tab"]')];

function selectTab(tab) {
  tabs.forEach(t => {
    const active = t === tab;
    t.setAttribute("aria-selected", active);
    t.tabIndex = active ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
  });
  tab.focus();
}

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  // Navegação por teclado: setas, Home e End
  tab.addEventListener("keydown", e => {
    let next = null;
    if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
    if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
    if (e.key === "Home") next = tabs[0];
    if (e.key === "End") next = tabs[tabs.length - 1];
    if (next) { e.preventDefault(); selectTab(next); }
  });
});

/* 4) Checklist de proteção ---------------------------------- */
const boxes = [...document.querySelectorAll("#checklist input")];
const bar = document.getElementById("bar");
const fill = document.getElementById("barFill");
const barText = document.getElementById("barText");

function updateProgress() {
  const done = boxes.filter(b => b.checked).length;
  fill.style.width = (done / boxes.length * 100) + "%";
  bar.setAttribute("aria-valuenow", done);
  barText.textContent = done === boxes.length
    ? "6 de 6 hábitos marcados. Ótimo trabalho!"
    : `${done} de ${boxes.length} hábitos marcados.`;
}
boxes.forEach(b => b.addEventListener("change", updateProgress));

/* 5) Aparição suave dos cards ao rolar a página ------------- */
const items = document.querySelectorAll(".grid .window");
if ("IntersectionObserver" in window && !reduceMotion) {
  items.forEach(el => el.classList.add("reveal"));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
}
