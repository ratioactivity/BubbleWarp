window.onload = () => {
  const logo = document.getElementById("logo");
  const bubblesContainer = document.getElementById("bubbles-container");

  // time counter
  let start = Date.now();
  setInterval(() => {
    const elapsed = Math.floor((Date.now() - start) / 1000);
    document.getElementById("timer").textContent = `Time wasted: ${elapsed}s`;
  }, 1000);

  // click counter
  let clicks = parseInt(localStorage.getItem("clicks")) || 0;
  document.getElementById("clicks").textContent = `Bubbles burst: ${clicks}`;

  const bubbleSounds = [
    "assets/bubblesound1.mp3", "assets/bubblesound2.mp3",
    "assets/bubblesound3.mp3", "assets/bubblesound4.mp3",
    "assets/bubblesound5.mp3", "assets/bubblesound6.mp3",
    "assets/bubblesound7.mp3", "assets/bubblesound8.mp3"
  ];

  logo.addEventListener("click", () => {
    clicks++;
    localStorage.setItem("clicks", clicks);
    document.getElementById("clicks").textContent = `Bubbles burst: ${clicks}`;

    // play bubble or whale sound
    const soundSrc = (clicks % 100 === 0)
      ? "assets/orca-sound.mp3"
      : bubbleSounds[Math.floor(Math.random() * bubbleSounds.length)];
    new Audio(soundSrc).play();

    // bubbles animation
    spawnBubbles(bubblesContainer, 12);

    // instantly open random link (no delay)
    const randomLink = links[Math.floor(Math.random() * links.length)];
    window.open(randomLink, "_blank");
  });

  // idle bubbles
  setInterval(() => spawnBubbles(bubblesContainer, 2, true), 1200);
};

// bubble generator
function spawnBubbles(container, count, idle = false) {
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement("img");
    const n = Math.ceil(Math.random() * 8);

    // fallback for missing bubble file
    bubble.onerror = () => { bubble.remove(); };

    bubble.src = `assets/bubble${n}.png`;
    bubble.className = "bubble";
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${3 + Math.random() * 5}s`;
    bubble.style.width = `${10 + Math.random() * 30}px`;
    container.appendChild(bubble);
    setTimeout(() => bubble.remove(), 8000);
  }
}
