window.onload = () => {
  const logo = document.getElementById("logo");
  const bubblesContainer = document.getElementById("bubbles-container");
  const noItch = document.getElementById("no-itch");
  const footerIcon = document.getElementById("footer-icon");

  // ---- Timer ----
  let start = Date.now();
  setInterval(() => {
    const elapsed = Math.floor((Date.now() - start) / 1000);
    document.getElementById("timer").textContent = `Time wasted: ${elapsed}s`;
  }, 1000);

  // ---- Click counter ----
  let clicks = parseInt(localStorage.getItem("clicks")) || 0;
  document.getElementById("clicks").textContent = `Bubbles burst: ${clicks}`;

  // ---- Audio Setup ----
  const sounds = [
    "sounds/bubblesound1.mp3", "sounds/bubblesound2.mp3",
    "sounds/bubblesound3.mp3", "sounds/bubblesound4.mp3",
    "sounds/bubblesound5.mp3", "sounds/bubblesound6.mp3",
    "sounds/bubblesound7.mp3", "sounds/bubblesound8.mp3"
  ];

  const whaleSound = "sounds/whalesounds.mp3";

  // Reusable HTMLAudioElement version for browser compatibility
  function playSound(file) {
    const audio = new Audio(file);
    audio.volume = 0.8;
    audio.play().catch((err) => console.warn("Audio blocked until user interaction:", err));
  }

  // ---- Main click ----
  logo.addEventListener("click", () => {
    clicks++;
    localStorage.setItem("clicks", clicks);
    document.getElementById("clicks").textContent = `Bubbles burst: ${clicks}`;

    // pick and play sound
    const soundSrc = (clicks % 100 === 0) ? whaleSound :
      sounds[Math.floor(Math.random() * sounds.length)];
    playSound(soundSrc);

    // bubbles
    spawnBubbles(bubblesContainer, 12);

    // open link (filter if checkbox checked)
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
    bubble.src = `assets/bubble${n}.png`;    bubble.className = "bubble";
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${3 + Math.random() * 5}s`;
    bubble.style.width = `${10 + Math.random() * 30}px`;
    container.appendChild(bubble);
    setTimeout(() => bubble.remove(), 8000);
  }
}
