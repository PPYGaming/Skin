const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const resultTitle = document.getElementById("resultTitle");
const resultCount = document.getElementById("resultCount");
const youtubeLink = document.getElementById("youtubeLink");
const instagramLink = document.getElementById("instagramLink");
const facebookLink = document.getElementById("facebookLink");
const youtubeTitle = document.getElementById("youtubeTitle");
const instagramTitle = document.getElementById("instagramTitle");
const facebookTitle = document.getElementById("facebookTitle");
const themeBtn = document.getElementById("themeBtn");

function searchAnime(value) {
  const query = value.trim();
  if (!query) {
    input.focus();
    return;
  }

  const encoded = encodeURIComponent(query);
  const label = query.length > 30 ? query.slice(0, 30) + "…" : query;

  resultTitle.textContent = `Results for “${label}”`;
  resultCount.textContent = "3 platforms";

  youtubeTitle.textContent = `${label} videos`;
  instagramTitle.textContent = `${label} content`;
  facebookTitle.textContent = `${label} posts`;

  youtubeLink.href = `https://www.youtube.com/results?search_query=${encoded}`;
  instagramLink.href = `https://www.instagram.com/explore/search/keyword/?q=${encoded}`;
  facebookLink.href = `https://www.facebook.com/search/top?q=${encoded}`;

  document.getElementById("resultsSection").scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchAnime(input.value);
});

document.querySelectorAll("[data-search]").forEach(button => {
  button.addEventListener("click", () => {
    input.value = button.dataset.search;
    searchAnime(button.dataset.search);
  });
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const light = document.body.classList.contains("light");
  themeBtn.textContent = light ? "🌙" : "☀️";
  localStorage.setItem("tc-theme", light ? "light" : "dark");
});

if (localStorage.getItem("tc-theme") === "light") {
  document.body.classList.add("light");
  themeBtn.textContent = "🌙";
}

document.getElementById("year").textContent = new Date().getFullYear();
