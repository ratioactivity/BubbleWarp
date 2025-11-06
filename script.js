window.onload = () => {
  const logo = document.getElementById("logo");
  const bubblesContainer = document.getElementById("bubbles-container");
  const noItch = document.getElementById("no-itch");
  const footerIcon = document.getElementById("footer-icon");
  const soundToggle = document.getElementById("sound-toggle");
  const whaleOverlay = document.getElementById("whale-overlay");

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

    // open random link
    let filtered = links;
    if (noItch.checked) filtered = links.filter(l => !l.includes("itch.io"));
    const randomLink = filtered[Math.floor(Math.random() * filtered.length)];
    if (randomLink) window.open(randomLink, "_blank");
  });

  // ---- Footer icon link ----
  footerIcon.addEventListener("click", () => {
    window.open("https://github.com/ratioactivity", "_blank");
  });

  // ---- Idle bubbles ----
  setInterval(() => spawnBubbles(bubblesContainer, 2, true), 1200);
};

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
