window.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("logo");
  const bubblesContainer = document.getElementById("bubbles-container");
  const noItch = document.getElementById("no-itch");
  const footerIcon = document.getElementById("footer-icon");
  const soundToggle = document.getElementById("sound-toggle");
  const whaleOverlay = document.getElementById("whale-overlay");
  const linkFrame = document.getElementById("link-frame");

  // ---- Timer ----
  let start = Date.now();
  setInterval(() => {
    const elapsed = Math.floor((Date.now() - start) / 1000);
    document.getElementById("timer").textContent = `Time wasted: ${elapsed}s`;
  }, 1000);

  // ---- Click counter ----
  let clicks = parseInt(localStorage.getItem("clicks")) || 0;
  document.getElementById("clicks").textContent = `Bubbles burst: ${clicks}`;

  // ---- Sound preference ----
  let soundEnabled = JSON.parse(localStorage.getItem("soundEnabled") || "true");
  soundToggle.checked = soundEnabled;

  soundToggle.addEventListener("change", () => {
    soundEnabled = soundToggle.checked;
    localStorage.setItem("soundEnabled", soundEnabled);
  });

  // ---- Audio setup ----
  const sounds = [
    "sounds/bubblesound1.mp3", "sounds/bubblesound2.mp3",
    "sounds/bubblesound3.mp3", "sounds/bubblesound4.mp3",
    "sounds/bubblesound5.mp3", "sounds/bubblesound6.mp3",
    "sounds/bubblesound7.mp3", "sounds/bubblesound8.mp3"
  ];
  const whaleSound = "sounds/whalesounds.mp3";

  function playSound(file) {
    if (!soundEnabled) return;
    const audio = new Audio(file);
    audio.volume = 0.8;
    audio.play().catch(err => console.warn("Audio blocked:", err));
  }

  // ---- Whale event ----
  function triggerWhaleEvent() {
    whaleOverlay.classList.add("active");
    playSound(whaleSound);

    // flood the screen with bubbles
    spawnBubbles(bubblesContainer, 60);
    document.body.style.background =
      "linear-gradient(180deg, #001a33, #00101f)";

    setTimeout(() => {
      whaleOverlay.classList.remove("active");
      document.body.style.background =
        "linear-gradient(180deg, #a3e7ff, #6ec3ff)";
    }, 4000);
  }

  // EXPOSE for console testing
  window.triggerWhaleEvent = triggerWhaleEvent;

  // ---- Main click ----
  logo.addEventListener("click", () => {
    clicks++;
    localStorage.setItem("clicks", clicks);
    document.getElementById("clicks").textContent =
      `Bubbles burst: ${clicks}`;

    if (clicks % 100 === 0) {
      triggerWhaleEvent();
    } else {
      const soundSrc = sounds[Math.floor(Math.random() * sounds.length)];
      playSound(soundSrc);
      spawnBubbles(bubblesContainer, 12);
    }

    const filtered = noItch.checked
      ? links.filter(l => !l.includes("itch.io"))
      : links;
    const randomLink = filtered[Math.floor(Math.random() * filtered.length)];

    if (randomLink) {
      latestLink = randomLink;
      window.open(randomLink, "_blank");
      showFintasticPopup(randomLink);
    }
  });

  // ---- Footer icon link ----
  footerIcon.addEventListener("click", () => {
    window.open("https://github.com/ratioactivity", "_blank");
  });

  // ---- Idle bubbles ----
  setInterval(() => spawnBubbles(bubblesContainer, 2, true), 1200);

  // ---- Finternet Favorites System ----
  const favoritesBtn = document.getElementById("favorites-button");
  const favoritesOverlay = document.getElementById("favorites-overlay");
  const favoritesList = document.getElementById("favorites-list");
  const closeFavorites = document.getElementById("close-favorites");
  const fintasticPopup = document.getElementById("fintastic-popup");
  const addFavBtn = document.getElementById("add-favorite-button");

  // Load favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  renderFavorites();

  function renderFavorites() {
    favoritesList.innerHTML = "";
    if (favorites.length === 0) {
      favoritesList.innerHTML = "<li>No favorites yet — go exploring!</li>";
      return;
    }
    favorites.forEach(url => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = url;
      a.textContent = url.replace("https://", "").replace("http://", "");
      a.target = "_blank";

      const remove = document.createElement("span");
      remove.textContent = "✖";
      remove.className = "remove-favorite";
      remove.addEventListener("click", () => {
        favorites = favorites.filter(f => f !== url);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
      });

      li.appendChild(a);
      li.appendChild(remove);
      favoritesList.appendChild(li);
    });
  }

  favoritesBtn.addEventListener("click", () => {
    favoritesOverlay.classList.add("active");
  });

  closeFavorites.addEventListener("click", () => {
    favoritesOverlay.classList.remove("active");
  });

  // Store latest opened link
  let latestLink = null;

  // Function to show the "That link was fintastic!" popup
  function showFintasticPopup(latestUrl) {
    fintasticPopup.classList.add("show");
    fintasticPopup.onclick = () => {
      if (!favorites.includes(latestUrl)) {
        favorites.push(latestUrl);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
      }
      fintasticPopup.classList.remove("show");
    };

    setTimeout(() => fintasticPopup.classList.remove("show"), 6000);
  }

  // Add manual add button handler
  addFavBtn.addEventListener("click", () => {
    if (!latestLink) {
      alert("You haven't opened any links yet!");
      return;
    }
    if (!favorites.includes(latestLink)) {
      favorites.push(latestLink);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderFavorites();
      alert("Added to Finternet Favorites!");
    } else {
      alert("That link’s already in your Finternet Favorites!");
    }
  });

  console.log("✅ script validated");
});


// ---- Bubble animation ----
function spawnBubbles(container, count, idle = false) {
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement("img");
    const n = Math.ceil(Math.random() * 7);
    bubble.src = `assets/bubble${n}.png`;
    bubble.className = "bubble";
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${3 + Math.random() * 5}s`;
    bubble.style.width = `${10 + Math.random() * 30}px`;
    container.appendChild(bubble);
    setTimeout(() => bubble.remove(), 8000);
  }
}
