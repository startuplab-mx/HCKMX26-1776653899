const html = document.documentElement;
const btn = document.getElementById("theme-toggle");
const sun = document.getElementById("icon-sun");
const moon = document.getElementById("icon-moon");

const saved = localStorage.getItem("sentinel-theme");
if (saved) {
  html.setAttribute("data-theme", saved);
  sun.style.display = saved === "dark" ? "none" : "";
  moon.style.display = saved === "dark" ? "" : "none";
}

btn.addEventListener("click", () => {
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("sentinel-theme", next);
  sun.style.display = next === "dark" ? "none" : "";
  moon.style.display = next === "dark" ? "" : "none";
});

function setActive(el) {
  document
    .querySelectorAll(".sidebar-link")
    .forEach((l) => l.classList.remove("active"));
  el.classList.add("active");
}

function copyCode(btn) {
  const pre = btn.closest(".code-block").querySelector("pre");
  navigator.clipboard.writeText(pre.innerText).then(() => {
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 1800);
  });
}

const content = document.getElementById("content");
content.addEventListener("scroll", () => {
  let current = "";
  document.querySelectorAll("[id]").forEach((el) => {
    if (el.offsetTop - 80 <= content.scrollTop) current = el.id;
  });
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current)
      link.classList.add("active");
  });
});
