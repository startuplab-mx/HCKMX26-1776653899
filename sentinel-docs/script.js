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

// API Key Generator Logic
const generateKeyBtn = document.getElementById("generate-key-btn");
if (generateKeyBtn) {
  generateKeyBtn.addEventListener("click", () => {
    const projectInput = document.getElementById("api-key-project").value.trim() || "dev";
    const resultContainer = document.getElementById("api-key-result-container");
    const resultEl = document.getElementById("api-key-result");
    
    generateKeyBtn.textContent = "Generando...";
    generateKeyBtn.style.opacity = "0.7";
    
    // Simulate network delay for effect
    setTimeout(() => {
      const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const generatedKey = `sk_test_${projectInput.toLowerCase().replace(/[^a-z0-9]/g, '')}_${randomString}`;
      
      resultEl.textContent = generatedKey;
      resultContainer.style.display = "block";
      
      generateKeyBtn.textContent = "Generar Key";
      generateKeyBtn.style.opacity = "1";
    }, 600);
  });
}

function copyGeneratedKey(btn) {
  const code = document.getElementById("api-key-result").textContent;
  navigator.clipboard.writeText(code).then(() => {
    const originalText = btn.textContent;
    btn.textContent = "¡Copiado!";
    btn.style.borderColor = "oklch(60% 0.18 75)";
    btn.style.color = "oklch(60% 0.18 75)";
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.borderColor = "var(--border)";
      btn.style.color = "var(--fg)";
    }, 2000);
  });
}
