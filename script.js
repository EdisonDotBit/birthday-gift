const scenes = {
  intro: document.getElementById("intro"),
  book: document.getElementById("bookScene"),
  gift: document.getElementById("giftScene"),
  drawing: document.getElementById("drawingScene"),
  cake: document.getElementById("cakeScene"),
  final: document.getElementById("finalScene")
};

const music = document.getElementById("birthdayMusic");

function showScene(scene) {
  Object.values(scenes).forEach(s => s.classList.remove("active"));
  scene.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------------- MUSIC ----------------
// Browsers normally require a user interaction before audio can play.
// The first envelope click is therefore used to start the music.

function startMusic() {
  music.volume = 0.35;
  music.play().catch(() => {
    // If autoplay is still blocked, the experience continues silently.
  });
}

// ---------------- ENVELOPE ----------------
const envelopeButton = document.getElementById("envelopeButton");

envelopeButton.addEventListener("click", () => {
  startMusic();
  envelopeButton.classList.add("opened");

  setTimeout(() => {
    showScene(scenes.book);
  }, 700);
});

// ---------------- BOOK ----------------
const pages = [...document.querySelectorAll(".page")];
const nextPage = document.getElementById("nextPage");
const prevPage = document.getElementById("prevPage");
const pageCounter = document.getElementById("pageCounter");
const toGiftButton = document.getElementById("toGiftButton");

let currentPage = 0;

function updateBook() {
  pages.forEach((page, index) => {
    page.classList.toggle("active-page", index === currentPage);
  });

  prevPage.disabled = currentPage === 0;
  nextPage.disabled = currentPage === pages.length - 1;
  pageCounter.textContent = `${currentPage + 1} / ${pages.length}`;
}

nextPage.addEventListener("click", () => {
  if (currentPage < pages.length - 1) {
    currentPage++;
    updateBook();
  }
});

prevPage.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    updateBook();
  }
});

toGiftButton.addEventListener("click", () => {
  showScene(scenes.gift);
});

// ---------------- GIFT ----------------
const giftButton = document.getElementById("giftButton");
const giftHint = document.getElementById("giftHint");

giftButton.addEventListener("click", () => {
  giftButton.classList.add("opened");
  giftHint.textContent = "Opening your gift...";

  setTimeout(() => {
    showScene(scenes.drawing);
  }, 850);
});

// ---------------- DRAWING ----------------
document.getElementById("toCakeButton").addEventListener("click", () => {
  showScene(scenes.cake);
});

// ---------------- CAKE / MICROPHONE ----------------
const micButton = document.getElementById("micButton");
const blowButton = document.getElementById("blowButton");
const micStatus = document.getElementById("micStatus");
const blowMessage = document.getElementById("blowMessage");
const flame = document.getElementById("flame");

let audioContext = null;
let analyser = null;
let microphone = null;
let micStream = null;
let monitoring = false;
let blownOut = false;

// You can adjust this if your microphone is too sensitive/not sensitive enough.
const BLOW_THRESHOLD = 0.16;

async function enableMicrophone() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    micStatus.textContent =
      "Microphone access isn't supported here. You can use the button below instead.";
    blowButton.classList.remove("hidden");
    return;
  }

  try {
    micStatus.textContent = "Listening... blow toward your microphone!";

    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false
      }
    });

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.65;

    microphone = audioContext.createMediaStreamSource(micStream);
    microphone.connect(analyser);

    monitoring = true;
    micButton.textContent = "🎤 Microphone active";
    micButton.disabled = true;

    detectBlow();
  } catch (error) {
    console.error(error);
    micStatus.textContent =
      "Microphone permission wasn't available. You can use the manual button instead.";
    blowButton.classList.remove("hidden");
  }
}

function getVolume() {
  const data = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);

  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    const normalized = (data[i] - 128) / 128;
    sum += normalized * normalized;
  }

  return Math.sqrt(sum / data.length);
}

function detectBlow() {
  if (!monitoring || blownOut) return;

  const volume = getVolume();

  if (volume > BLOW_THRESHOLD) {
    putOutCandle();
    return;
  }

  requestAnimationFrame(detectBlow);
}

micButton.addEventListener("click", enableMicrophone);

blowButton.addEventListener("click", putOutCandle);

function putOutCandle() {
  if (blownOut) return;

  blownOut = true;
  monitoring = false;

  flame.classList.add("out");
  blowMessage.textContent = "You did it! ✨ Make that wish.";
  micStatus.textContent = "";

  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
  }

  if (audioContext) {
    audioContext.close().catch(() => {});
  }

  setTimeout(() => {
    showFinal();
  }, 1600);
}

// ---------------- FINAL ----------------
function showFinal() {
  showScene(scenes.final);
  createConfetti();
}

function createConfetti() {
  const layer = document.getElementById("confettiLayer");
  layer.innerHTML = "";

  const symbols = ["♡", "✦", "♥", "✧", "•"];

  for (let i = 0; i < 45; i++) {
    const item = document.createElement("span");
    item.className = "confetti";
    item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    item.style.left = `${Math.random() * 100}%`;
    item.style.animationDelay = `${Math.random() * 1.5}s`;
    item.style.animationDuration = `${2.2 + Math.random() * 2}s`;
    layer.appendChild(item);
  }
}

// ---------------- REPLAY ----------------
document.getElementById("restartButton").addEventListener("click", () => {
  currentPage = 0;
  updateBook();
  
  envelopeButton.classList.remove("opened");

  giftButton.classList.remove("opened");
  giftHint.textContent = "tap the gift";

  flame.classList.remove("out");
  blowMessage.textContent =
    "Blow toward your microphone to put out the candle.";

  micButton.textContent = "🎤 Enable microphone";
  micButton.disabled = false;
  blowButton.classList.add("hidden");
  micStatus.textContent = "";

  blownOut = false;
  monitoring = false;

  showScene(scenes.intro);
});

updateBook();
