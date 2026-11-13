const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

const cards = [...document.querySelectorAll(".destination-card")];
const chips = [...document.querySelectorAll(".chip")];
const searchInput = document.getElementById("destinationSearch");
const styleFilter = document.getElementById("styleFilter");
const budgetFilter = document.getElementById("budgetFilter");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
let activeCategory = "all";

function filterDestinations() {
  const query = searchInput.value.trim().toLowerCase();
  const style = styleFilter.value;
  const budget = budgetFilter.value;
  let visible = 0;
  cards.forEach(card => {
    const matchesText = card.dataset.name.toLowerCase().includes(query);
    const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
    const matchesStyle = style === "all" || card.dataset.category === style;
    const matchesBudget = budget === "all" || card.dataset.budget === budget;
    const show = matchesText && matchesCategory && matchesStyle && matchesBudget;
    card.hidden = !show;
    if (show) visible++;
  });
  resultCount.textContent = `${visible} destination${visible === 1 ? "" : "s"}`;
  emptyState.hidden = visible !== 0;
}
chips.forEach(chip => chip.addEventListener("click", () => {
  chips.forEach(item => item.classList.remove("active"));
  chip.classList.add("active");
  activeCategory = chip.dataset.category;
  styleFilter.value = "all";
  filterDestinations();
}));
document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  activeCategory = "all";
  chips.forEach(chip => chip.classList.toggle("active", chip.dataset.category === "all"));
  filterDestinations();
  document.getElementById("destinations").scrollIntoView({ behavior: "smooth" });
});
searchInput.addEventListener("input", filterDestinations);
styleFilter.addEventListener("change", filterDestinations);
budgetFilter.addEventListener("change", filterDestinations);

document.querySelectorAll(".favorite").forEach(button => {
  const card = button.closest(".destination-card");
  const key = `wanderly-favorite-${card.dataset.name}`;
  const saved = localStorage.getItem(key) === "true";
  button.classList.toggle("saved", saved);
  button.textContent = saved ? "♥" : "♡";
  button.addEventListener("click", () => {
    const nowSaved = !button.classList.contains("saved");
    button.classList.toggle("saved", nowSaved);
    button.textContent = nowSaved ? "♥" : "♡";
    localStorage.setItem(key, String(nowSaved));
  });
});

const budgetForm = document.getElementById("budgetForm");
const estimate = document.getElementById("estimate");
function calculateBudget() {
  const base = Number(document.getElementById("calcStyle").value);
  const travellers = Math.min(20, Math.max(1, Number(document.getElementById("travellers").value) || 1));
  const days = Math.min(30, Math.max(1, Number(document.getElementById("days").value) || 1));
  const total = Math.round(base * travellers * (days / 4));
  estimate.textContent = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(total);
}
budgetForm.addEventListener("submit", event => { event.preventDefault(); calculateBudget(); });
["calcStyle", "travellers", "days"].forEach(id => document.getElementById(id).addEventListener("input", calculateBudget));
calculateBudget();
