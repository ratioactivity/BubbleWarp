window.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("logo");
  if (logo) {
    const duplicateLogos = Array.from(document.querySelectorAll("#logo"))
      .filter(node => node !== logo);
    duplicateLogos.forEach(node => node.remove());
  }
  const bubblesContainer = document.getElementById("bubbles-container");
  const noItch = document.getElementById("no-itch");
  const footerIcon = document.getElementById("footer-icon");
  const soundToggle = document.getElementById("sound-toggle");
  const whaleOverlay = document.getElementById("whale-overlay");
  const favoritesBtn = document.getElementById("favorites-button");
  const favoritesOverlay = document.getElementById("favorites-overlay");
  const favoritesList = document.getElementById("favorites-list");
  const closeFavorites = document.getElementById("close-favorites");
  const addFavBtn = document.getElementById("add-favorite-button");
  const defaultFavBtnLabel = addFavBtn.textContent;
  const menuButton = document.getElementById("menu-button");
  const menuModal = document.getElementById("menu-modal");
  const menuBackdrop = document.getElementById("menu-backdrop");
  const menuClose = document.getElementById("menu-close");
  const menuTabs = Array.from(document.querySelectorAll(".menu-tab"));
  const menuPanels = Array.from(document.querySelectorAll(".menu-panel"));
  const menuNormalList = document.getElementById("menu-normal-list");
  const menuRadioactiveList = document.getElementById("menu-radioactive-list");
  let deepDiveMode = false;
  let favBtnResetTimer = null;
  let latestLink = null;

  const deepDiveTopics = [
    "radiation",
    "uranium glass",
    "radium paint",
    "dosimeters",
    "luminous dials",
    "civil defense meters",
    "fallout shelters",
    "chernobyl elephants foot",
    "nuclear semiotics",
    "radiation hormesis",
    "geiger counters",
    "radioactive decay chains",
    "hot particles",
    "half-life curves",
    "ionizing vs non-ionizing radiation",
    "cosmic rays",
    "alpha beta gamma shielding",
    "radiation badges",
    "tritium keychains",
    "luminous watch hands"
  ];

  const deepDiveTopicOverlay = document.createElement("div");
  deepDiveTopicOverlay.id = "deepdive-topic-overlay";
  deepDiveTopicOverlay.innerHTML = `
    <div class="deepdive-topic-box">
      <button class="deepdive-topic-close" aria-label="Close deep dive topic">✖</button>
      <p class="deepdive-topic-text"></p>
      <button class="deepdive-topic-search">Search This Topic</button>
    </div>
  `;
  document.body.appendChild(deepDiveTopicOverlay);

  const deepDiveTopicText = deepDiveTopicOverlay.querySelector(".deepdive-topic-text");
  const deepDiveTopicSearch = deepDiveTopicOverlay.querySelector(".deepdive-topic-search");
  const deepDiveTopicClose = deepDiveTopicOverlay.querySelector(".deepdive-topic-close");
  let deepDiveTopicTimer = null;

  function hideDeepDiveTopic() {
    deepDiveTopicOverlay.classList.remove("active");
    if (deepDiveTopicTimer) {
      clearTimeout(deepDiveTopicTimer);
      deepDiveTopicTimer = null;
    }
  }

  function showDeepDiveTopic(topic) {
    if (!topic) return;
    deepDiveTopicText.textContent = topic;
    deepDiveTopicSearch.onclick = () => {
      const q = encodeURIComponent(topic);
      window.open(`https://www.google.com/search?q=${q}`, "_blank");
    };
    hideDeepDiveTopic();
    deepDiveTopicOverlay.classList.add("active");
    deepDiveTopicTimer = setTimeout(hideDeepDiveTopic, 3000);
  }

  deepDiveTopicOverlay.addEventListener("click", event => {
    if (event.target === deepDiveTopicOverlay) {
      hideDeepDiveTopic();
    }
  });

  deepDiveTopicClose?.addEventListener("click", hideDeepDiveTopic);

  function pickRandomDeepDiveTopic() {
    return deepDiveTopics[Math.floor(Math.random() * deepDiveTopics.length)];
  }

  const radioactiveLinks = [
    "https://www.world-nuclear.org/",
    "https://www.nrc.gov/reading-rm/basic-ref/students.html",
    "https://www.iaea.org/newscenter",
    "https://www.nrc.gov/reactors/power.html",
    "https://inis.iaea.org/search/",
    "https://www.epa.gov/radiation",
    "https://www.energy.gov/ne/articles",
    "https://www.unscear.org/"
  ];

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
  if (soundToggle) {
    soundToggle.checked = soundEnabled;

    soundToggle.addEventListener("change", () => {
      soundEnabled = soundToggle.checked;
      localStorage.setItem("soundEnabled", soundEnabled);
    });
  }

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
  logo?.addEventListener("click", () => {
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

    if (deepDiveMode) {
      const topic = pickRandomDeepDiveTopic();
      showDeepDiveTopic(topic);
      return;
    }

    const filtered = noItch.checked
      ? links.filter(l => !l.includes("itch.io"))
      : links;
    const randomLink = filtered[Math.floor(Math.random() * filtered.length)];

    if (randomLink) {
      latestLink = randomLink;
      addFavBtn.textContent = defaultFavBtnLabel;
      addFavBtn.classList.remove("saved", "duplicate");
      if (favBtnResetTimer) {
        clearTimeout(favBtnResetTimer);
        favBtnResetTimer = null;
      }
      window.open(randomLink, "_blank");
    }
  });

  // ---- Footer icon link ----
  footerIcon?.addEventListener("click", () => {
    window.open("https://github.com/ratioactivity/BubbleWarp", "_blank");
  });

  // ---- Idle bubbles ----
  if (bubblesContainer) {
    spawnBubbles(bubblesContainer, 8, true);
    setInterval(() => spawnBubbles(bubblesContainer, 2, true), 1200);
  }

  // ---- Finternet Favorites System ----

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

  // Add manual add button handler
  addFavBtn.addEventListener("click", () => {
    if (!latestLink) {
      addFavBtn.textContent = "Open a link first";
      addFavBtn.classList.remove("saved");
      addFavBtn.classList.add("duplicate");
      if (favBtnResetTimer) clearTimeout(favBtnResetTimer);
      favBtnResetTimer = setTimeout(() => {
        addFavBtn.textContent = defaultFavBtnLabel;
        addFavBtn.classList.remove("duplicate");
        favBtnResetTimer = null;
      }, 2200);
      return;
    }

    if (!favorites.includes(latestLink)) {
      favorites.push(latestLink);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderFavorites();
      addFavBtn.textContent = "⭐ Saved to favorites!";
      addFavBtn.classList.remove("duplicate");
      addFavBtn.classList.add("saved");
    } else {
      addFavBtn.textContent = "Already in favorites";
      addFavBtn.classList.remove("saved");
      addFavBtn.classList.add("duplicate");
    }

    if (favBtnResetTimer) clearTimeout(favBtnResetTimer);
    favBtnResetTimer = setTimeout(() => {
      addFavBtn.textContent = defaultFavBtnLabel;
      addFavBtn.classList.remove("saved", "duplicate");
      favBtnResetTimer = null;
    }, 2200);
  });

  // ---- Menu Modal ----
  function toggleMenu(open) {
    if (!menuModal) return;
    menuModal.classList.toggle("open", open);
    menuModal.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function activateMenuTab(tabName) {
    menuTabs.forEach(tab => {
      tab.classList.toggle("active", tab.dataset.tab === tabName);
    });
    menuPanels.forEach(panel => {
      panel.classList.toggle("active", panel.dataset.panel === tabName);
    });
  }

  function renderMenuSection(container, items, linkFactory, labelFactory) {
    if (!container) return;
    container.innerHTML = "";
    items.forEach(item => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      const href = linkFactory(item);
      a.href = href;
      a.target = "_blank";
      a.textContent = labelFactory(item);
      li.appendChild(a);
      container.appendChild(li);
    });
  }

  if (
    menuButton &&
    menuModal &&
    menuBackdrop &&
    menuClose &&
    menuTabs.length &&
    menuPanels.length &&
    menuNormalList &&
    menuRadioactiveList
  ) {
    renderMenuSection(
      menuNormalList,
      Array.isArray(links) ? links : [],
      item => item,
      item => item.replace(/^https?:\/\//, "")
    );
    renderMenuSection(
      menuRadioactiveList,
      radioactiveLinks,
      item => item,
      item => item.replace(/^https?:\/\//, "")
    );

    menuButton.addEventListener("click", () => toggleMenu(true));
    menuClose.addEventListener("click", () => toggleMenu(false));
    menuBackdrop.addEventListener("click", () => toggleMenu(false));
    menuTabs.forEach(tab => {
      tab.addEventListener("click", () => activateMenuTab(tab.dataset.tab));
    });
  }

  // ---- Deep Dive Mode ----
  const deepDiveToggle = document.getElementById("deepdive-toggle");
  if (deepDiveToggle) {
    deepDiveMode = JSON.parse(localStorage.getItem("deepDiveMode") || "false");
    deepDiveToggle.checked = deepDiveMode;
    document.body.classList.toggle("deep-dive", deepDiveMode);

    deepDiveToggle.addEventListener("change", () => {
      deepDiveMode = deepDiveToggle.checked;
      localStorage.setItem("deepDiveMode", deepDiveMode);
      document.body.classList.toggle("deep-dive", deepDiveMode);
    });
  }

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
