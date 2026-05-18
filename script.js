const typingText = document.querySelector("#typingText");
const musicToggle = document.querySelector("#musicToggle");
const musicText = document.querySelector("#musicText");
const surpriseBtn = document.querySelector("#surpriseBtn");
const surpriseModal = document.querySelector("#surpriseModal");
const closeSurprise = document.querySelector("#closeSurprise");
const moreConfetti = document.querySelector("#moreConfetti");
const imageModal = document.querySelector("#imageModal");
const expandedImage = document.querySelector("#expandedImage");
const closeImage = document.querySelector("#closeImage");
const secretButton = document.querySelector("#secretButton");
const secretModal = document.querySelector("#secretModal");
const closeSecret = document.querySelector("#closeSecret");
const funnyAudio = document.querySelector("#funnyAudio");
const floatingLayer = document.querySelector("#floatingLayer");
const confettiLayer = document.querySelector("#confettiLayer");
const particleCanvas = document.querySelector("#particleCanvas");
const particleCtx = particleCanvas.getContext("2d");
const fireworkCanvas = document.querySelector("#fireworkCanvas");
const fireworkCtx = fireworkCanvas.getContext("2d");
const endingTyping = document.querySelector(".forever-card h2, #endingTyping");

if (endingTyping) {
  endingTyping.textContent = "";
}

const typingPhrases = [
  "Bestie, this whole blue universe is for you.",
  "May your day be full of cake, chaos, laughter, and wins.",
  "Some friends become family. You became that person."
];

let typingPhraseIndex = 0;
let typingCharIndex = 0;
let isDeleting = false;
let audioContext;
let melodyTimer;
let isMusicPlaying = false;
let musicVolume = 0.11;
let particles = [];
let fireworks = [];
let endingStarted = false;
const endingText = "No matter how annoying you are\u2026\nyou\u2019ll always be my favorite person \uD83D\uDC99";

function resizeCanvases() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
  fireworkCanvas.width = window.innerWidth;
  fireworkCanvas.height = window.innerHeight;
  createParticles();
}

function createParticles() {
  const total = Math.min(120, Math.floor(window.innerWidth / 9));
  particles = Array.from({ length: total }, () => ({
    x: Math.random() * particleCanvas.width,
    y: Math.random() * particleCanvas.height,
    radius: Math.random() * 1.8 + 0.5,
    speed: Math.random() * 0.45 + 0.15,
    alpha: Math.random() * 0.6 + 0.25
  }));
}

function drawParticles() {
  particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles.forEach((particle) => {
    particle.y += particle.speed;
    particle.x += Math.sin(particle.y * 0.01) * 0.18;

    if (particle.y > particleCanvas.height + 8) {
      particle.y = -8;
      particle.x = Math.random() * particleCanvas.width;
    }

    particleCtx.beginPath();
    particleCtx.fillStyle = `rgba(103, 232, 249, ${particle.alpha})`;
    particleCtx.shadowColor = "#67e8f9";
    particleCtx.shadowBlur = 12;
    particleCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    particleCtx.fill();
  });
  particleCtx.shadowBlur = 0;
  requestAnimationFrame(drawParticles);
}

function typeLoop() {
  const phrase = typingPhrases[typingPhraseIndex];
  typingText.textContent = phrase.slice(0, typingCharIndex);

  if (!isDeleting && typingCharIndex < phrase.length) {
    typingCharIndex += 1;
    setTimeout(typeLoop, 58);
    return;
  }

  if (!isDeleting && typingCharIndex === phrase.length) {
    isDeleting = true;
    setTimeout(typeLoop, 1300);
    return;
  }

  if (isDeleting && typingCharIndex > 0) {
    typingCharIndex -= 1;
    setTimeout(typeLoop, 28);
    return;
  }

  isDeleting = false;
  typingPhraseIndex = (typingPhraseIndex + 1) % typingPhrases.length;
  setTimeout(typeLoop, 280);
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

  const endingObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        musicVolume = 0.045;
        startEndingTyping();
      } else {
        musicVolume = 0.11;
      }
    });
  }, { threshold: 0.45 });

  const endingSection = document.querySelector(".forever-section, .ending-section");
  if (endingSection) endingObserver.observe(endingSection);
}

function createFloatingShape() {
  const shape = document.createElement("span");
  const isBalloon = Math.random() > 0.58;
  const symbols = ["\uD83D\uDC99", "\u2728", "\u2605", "\u2726", "\u2661"];
  const colors = ["#38bdf8", "#67e8f9", "#facc15", "#fb7185", "#ffffff"];

  shape.className = isBalloon ? "floating-shape balloon" : "floating-shape";
  shape.style.left = `${Math.random() * 100}vw`;
  shape.style.bottom = "-5rem";
  shape.style.animationDuration = `${7 + Math.random() * 7}s`;
  shape.style.opacity = `${0.45 + Math.random() * 0.45}`;

  if (isBalloon) {
    shape.style.background = `linear-gradient(135deg, ${colors[Math.floor(Math.random() * colors.length)]}, #2563eb)`;
  } else {
    shape.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    shape.style.color = colors[Math.floor(Math.random() * colors.length)];
    shape.style.fontSize = `${1 + Math.random() * 1.25}rem`;
  }

  floatingLayer.appendChild(shape);
  setTimeout(() => shape.remove(), 15000);
}

function burstConfetti(amount = 90) {
  const colors = ["#38bdf8", "#67e8f9", "#2563eb", "#facc15", "#fb7185", "#ffffff"];

  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = `${-20 - Math.random() * 40}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.4 + Math.random() * 2.8}s`;
    piece.style.animationDelay = `${Math.random() * 0.25}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 5800);
  }
}

function spawnFirework(x = Math.random() * fireworkCanvas.width, y = Math.random() * fireworkCanvas.height * 0.45 + 70) {
  const colors = ["#38bdf8", "#67e8f9", "#2563eb", "#facc15", "#fb7185", "#ffffff"];

  for (let i = 0; i < 58; i += 1) {
    const angle = (Math.PI * 2 * i) / 58;
    const speed = 1.6 + Math.random() * 5.2;
    fireworks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      size: Math.random() * 2.2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function drawFireworks() {
  fireworkCtx.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);
  fireworks = fireworks.filter((particle) => particle.alpha > 0.025);

  fireworks.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.035;
    particle.alpha *= 0.962;

    fireworkCtx.globalAlpha = particle.alpha;
    fireworkCtx.fillStyle = particle.color;
    fireworkCtx.shadowColor = particle.color;
    fireworkCtx.shadowBlur = 16;
    fireworkCtx.beginPath();
    fireworkCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    fireworkCtx.fill();
  });

  fireworkCtx.globalAlpha = 1;
  fireworkCtx.shadowBlur = 0;
  requestAnimationFrame(drawFireworks);
}

function playNote(frequency, duration = 0.24) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.value = frequency;
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(musicVolume, audioContext.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration + 0.03);
}

function startMusic() {
  audioContext = audioContext || new AudioContext();
  const notes = [262, 262, 294, 262, 349, 330, 262, 262, 294, 262, 392, 349, 262, 262, 523, 440, 349, 330, 294];
  let noteIndex = 0;

  isMusicPlaying = true;
  musicToggle.classList.add("playing");
  musicToggle.setAttribute("aria-label", "Pause birthday music");
  musicText.textContent = "Pause music";
  playNote(notes[noteIndex], 0.28);

  melodyTimer = setInterval(() => {
    noteIndex = (noteIndex + 1) % notes.length;
    playNote(notes[noteIndex], noteIndex % 6 === 0 ? 0.4 : 0.24);
  }, 330);
}

function stopMusic() {
  isMusicPlaying = false;
  musicToggle.classList.remove("playing");
  musicToggle.setAttribute("aria-label", "Play birthday music");
  musicText.textContent = "Play music";
  clearInterval(melodyTimer);
}

function toggleMusic() {
  if (isMusicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
}

function openSurprise() {
  surpriseModal.hidden = false;
  burstConfetti(170);
  spawnFirework(window.innerWidth * 0.5, window.innerHeight * 0.28);
  setTimeout(() => spawnFirework(window.innerWidth * 0.25, window.innerHeight * 0.32), 180);
  setTimeout(() => spawnFirework(window.innerWidth * 0.75, window.innerHeight * 0.32), 360);
}

function closeSurpriseModal() {
  surpriseModal.hidden = true;
}

function openImageModal(src) {
  expandedImage.src = src;
  imageModal.hidden = false;
}

function closeImageModal() {
  imageModal.hidden = true;
  expandedImage.src = "";
}

function openSecretSurprise() {
  if (!secretModal) return;
  secretModal.hidden = false;
  document.body.classList.add("secret-open", "shake");
  burstConfetti(180);
  spawnFirework(window.innerWidth * 0.5, window.innerHeight * 0.3);

  if (funnyAudio) {
    funnyAudio.currentTime = 0;
    funnyAudio.play().catch(() => {});
  }

  setTimeout(() => document.body.classList.remove("shake"), 500);
}

function closeSecretSurprise() {
  if (!secretModal) return;
  secretModal.hidden = true;
  document.body.classList.remove("secret-open", "shake");
  if (funnyAudio) {
    funnyAudio.pause();
    funnyAudio.currentTime = 0;
  }
}

function startEndingTyping() {
  if (!endingTyping || endingStarted) return;
  endingStarted = true;
  endingTyping.textContent = "";
  let index = 0;

  function typeEnding() {
    endingTyping.textContent = endingText.slice(0, index);
    index += 1;

    if (index <= endingText.length) {
      setTimeout(typeEnding, 74);
    }
  }

  typeEnding();
}

document.querySelectorAll(".image-card, .polaroid-card").forEach((card) => {
  card.addEventListener("click", () => openImageModal(card.dataset.full));
});

musicToggle.addEventListener("click", toggleMusic);
surpriseBtn.addEventListener("click", openSurprise);
closeSurprise.addEventListener("click", closeSurpriseModal);
if (secretButton) secretButton.addEventListener("click", openSecretSurprise);
if (closeSecret) closeSecret.addEventListener("click", closeSecretSurprise);
moreConfetti.addEventListener("click", () => {
  burstConfetti(130);
  spawnFirework();
});
closeImage.addEventListener("click", closeImageModal);

surpriseModal.addEventListener("click", (event) => {
  if (event.target === surpriseModal) closeSurpriseModal();
});

imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) closeImageModal();
});

if (secretModal) {
  secretModal.addEventListener("click", (event) => {
    if (event.target === secretModal) closeSecretSurprise();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSurpriseModal();
    closeImageModal();
    closeSecretSurprise();
  }
});

window.addEventListener("resize", resizeCanvases);

resizeCanvases();
drawParticles();
drawFireworks();
typeLoop();
revealOnScroll();
burstConfetti(70);
setInterval(createFloatingShape, 850);
setInterval(() => spawnFirework(), 5400);
