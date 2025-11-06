window.onload = () => {
  const logo = document.getElementById("logo");
  const bubblesContainer = document.getElementById("bubbles-container");
  const noItch = document.getElementById("no-itch");

  // --- Timers ---
  let start = Date.now();
  setInterval(() => {
    const elapsed = Math.floor((Date.now() - start) / 1000);
    document.getElementById("timer").textContent = `Time wasted: ${elapsed}s`;
  }, 1000);

  // --- Click Counter ---
  let clicks = parseInt(localStorage.getItem("clicks")) || 0;
  document.getElementById("clicks").textContent = `Bubbles burst: ${clicks}`;

  // --- Sounds ---
  const bubbleSounds = [
    "assets/bubblesound1.mp3", "assets/bubblesound2.mp3",
    "assets/bubblesound3.mp3", "assets/bubblesound4.mp3",
    "assets/bubblesound5.mp3", "assets/bubblesound6.mp3",
    "assets/bubblesound7.mp3"
  ];

  // preload sounds to beat autoplay rules
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const playSound = async (path) => {
    try {
      const res = await fetch(path);
      const buf = await res.arrayBuffer();
      const audioBuf = await audioContext.decodeAudioData(buf);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuf;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (e) {
      console.warn("sound error:", e);
    }
  };

  // --- Click handler ---
  logo.addEventListener("click", () => {
    // resume context if user interacted
    if (audioContext.state === "suspended") audioContext.resume();

    clicks++;
    localStorage.setItem("clicks", clicks);
    document.getElementById("clicks").textContent = `Bubbles burst: ${clicks}`;

    // pick link
    let filtered = links;
    if (noItch.checked) {
      filtered = links.filter(l => !l.includes("itch.io"));
    }

    // play appropriate sound
    const soundSrc = (clicks % 100 === 0)
      ? "assets/orca-sound.mp3"
      : bubbleSounds[Math.floor(Math.random() * bubbleSounds.length)];
    playSound(soundSrc);

    // bubbles
    spawnBubbles(bubblesContainer, 12);

    // open random link
    const randomLink = filtered[Math.floor(Math.random() * filtered.length)];
    if (randomLink) window.open(randomLink, "_blank");
  });

  // idle bubbles
  setInterval(() => spawnBubbles(bubblesContainer, 2, true), 1200);
};

// --- Bubble generator ---
function spawnBubbles(container, count, idle = false) {
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement("img");
    const n = Math.ceil(Math.random() * 7); // only 1–7
    bubble.src = `assets/bubble${n}.png`;
    bubble.className = "bubble";
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${3 + Math.random() * 5}s`;
    bubble.style.width = `${10 + Math.random() * 30}px`;
    container.appendChild(bubble);
    setTimeout(() => bubble.remove(), 8000);
  }
}
