// Valentine's Proposal Website JavaScript

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const videoContainer = document.getElementById("videoContainer");
  const youtubeVideo = document.getElementById("youtubeVideo");
  const buttonsContainer = document.getElementById("buttonsContainer");

  // Variables for No button behavior
  let escapeAttempts = 0;
  let noButtonPosition = { x: 0, y: 0 };
  let isMoving = false;
  let player = null; // YouTube player instance

  // Initialize the website
  initWebsite();

  function initWebsite() {
    // Set initial No button position
    updateNoButtonPosition();

    // Add initial floating hearts
    createHearts(15);

    // Setup event listeners
    setupEventListeners();

    // Initialize YouTube player if API is loaded
    if (typeof YT !== "undefined") {
      initYouTubePlayer();
    }
  }

  function setupEventListeners() {
    // Yes button click handler
    yesBtn.addEventListener("click", handleYesClick);

    // No button click handler
    noBtn.addEventListener("click", handleNoClick);

    // No button hover handler - moves away from cursor
    noBtn.addEventListener("mouseover", handleNoHover);

    // No button touch handler for mobile
    noBtn.addEventListener("touchstart", handleNoTouch);

    // Update button position on window resize
    window.addEventListener("resize", updateNoButtonPosition);

    // Add click effect to Yes button
    yesBtn.addEventListener("mousedown", () => {
      yesBtn.classList.add("click-effect");
      setTimeout(() => yesBtn.classList.remove("click-effect"), 300);
    });
  }

  function initYouTubePlayer() {
    // Create YouTube player
    player = new YT.Player("youtubeVideo", {
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  }

  function onPlayerReady(event) {
    console.log("YouTube player is ready");
  }

  function onPlayerStateChange(event) {
    // You can add custom behavior based on player state changes
    if (event.data === YT.PlayerState.PLAYING) {
      console.log("Video started playing");
    }
  }

  function handleYesClick() {
    // Show the video container
    videoContainer.classList.remove("hidden");

    // Scroll to the video smoothly
    videoContainer.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Play YouTube video if available
    if (player && typeof player.playVideo === "function") {
      player.playVideo();
    } else {
      // Fallback: add autoplay to iframe src
      const currentSrc = youtubeVideo.src;
      if (!currentSrc.includes("autoplay=1")) {
        youtubeVideo.src = currentSrc.includes("?")
          ? currentSrc + "&autoplay=1"
          : currentSrc + "?autoplay=1";
      }
    }

    // Add celebration effects
    celebrateYes();

    // Update UI for celebration
    updateUIForCelebration();
  }

  function celebrateYes() {
    // Create more hearts
    createHearts(30);

    // Add special celebration animation
    createSpecialCelebration();

    // Change background
    document.body.style.background =
      "linear-gradient(-45deg, #ff4d6d, #ff8fa3, #ffafcc, #ffc3a0)";
    document.body.style.animation = "gradientBG 8s ease infinite";
  }

  function updateUIForCelebration() {
    // Update header
    const header = document.querySelector("h1");
    header.textContent = "She Said YES!";
    header.style.color = "#ff4d6d";
    header.style.animation = "pulse 1s 3";

    // Update Yes button
    yesBtn.innerHTML =
      '<i class="fas fa-heart"></i> You Said YES! <i class="fas fa-heart"></i>';
    yesBtn.style.animation = "pulse 0.7s infinite";
    yesBtn.style.fontSize = "1.6rem";
    yesBtn.style.background = "linear-gradient(to right, #ff4d6d, #ff3355)";

    // Hide No button
    noBtn.style.opacity = "0";
    noBtn.style.pointerEvents = "none";
  }

  function handleNoClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (isMoving) return;

    isMoving = true;
    escapeAttempts++;

    // Add click effect
    noBtn.classList.add("click-effect");
    setTimeout(() => noBtn.classList.remove("click-effect"), 300);

    // Move button to random position
    moveNoButtonRandomly();

    // Update button text and appearance
    updateNoButtonAppearance();

    // Make Yes button more appealing
    enhanceYesButton();

    // Show escape message
    showEscapeMessage(event.clientX, event.clientY);

    // Reset moving flag after animation
    setTimeout(() => {
      isMoving = false;
    }, 500);
  }

  function handleNoHover(event) {
    if (isMoving) return;

    isMoving = true;
    escapeAttempts++;

    // Calculate movement away from cursor
    const newPosition = calculateEscapePosition(event.clientX, event.clientY);

    // Move button
    moveNoButtonTo(newPosition.x, newPosition.y);

    // Update button text and appearance
    updateNoButtonAppearance();

    // Make Yes button more appealing
    enhanceYesButton();

    // Reset moving flag
    setTimeout(() => {
      isMoving = false;
    }, 400);
  }

  function handleNoTouch(event) {
    event.preventDefault();

    if (isMoving) return;

    isMoving = true;
    escapeAttempts++;

    // For touch devices, move randomly
    moveNoButtonRandomly();

    // Update button text and appearance
    updateNoButtonAppearance();

    // Make Yes button more appealing
    enhanceYesButton();

    // Reset moving flag
    setTimeout(() => {
      isMoving = false;
    }, 500);
  }

  function calculateEscapePosition(cursorX, cursorY) {
    // Get button and container dimensions
    const buttonRect = noBtn.getBoundingClientRect();
    const containerRect = buttonsContainer.getBoundingClientRect();

    // Calculate button center
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;

    // Calculate direction away from cursor
    const deltaX = buttonCenterX - cursorX;
    const deltaY = buttonCenterY - cursorY;

    // Normalize direction vector
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const directionX = deltaX / distance;
    const directionY = deltaY / distance;

    // Calculate escape distance (increases with attempts)
    const escapeDistance = 100 + escapeAttempts * 25;

    // Calculate new position
    let newX = noButtonPosition.x + directionX * escapeDistance;
    let newY = noButtonPosition.y + directionY * escapeDistance;

    // Ensure button stays within container
    const maxX = containerRect.width - noBtn.offsetWidth;
    const maxY = containerRect.height - noBtn.offsetHeight;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    return { x: newX, y: newY };
  }

  function moveNoButtonRandomly() {
    const containerRect = buttonsContainer.getBoundingClientRect();
    const maxX = containerRect.width - noBtn.offsetWidth;
    const maxY = containerRect.height - noBtn.offsetHeight;

    // Calculate random position
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    // Move to random position
    moveNoButtonTo(randomX, randomY);
  }

  function moveNoButtonTo(x, y) {
    // Add escape animation
    noBtn.classList.add("no-btn-escaping");

    // Apply movement
    noBtn.style.transition = "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;

    // Update stored position
    noButtonPosition = { x, y };

    // Remove animation class after animation completes
    setTimeout(() => {
      noBtn.classList.remove("no-btn-escaping");
    }, 600);
  }

  function updateNoButtonPosition() {
    const rect = noBtn.getBoundingClientRect();
    const containerRect = buttonsContainer.getBoundingClientRect();

    noButtonPosition = {
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top,
    };
  }

  function updateNoButtonAppearance() {
    // Messages based on escape attempts
    const messages = [
      '<i class="fas fa-times"></i> No',
      '<i class="fas fa-question"></i> Are you sure?',
      '<i class="fas fa-heart-broken"></i> Really?',
      '<i class="fas fa-surprise"></i> Think again!',
      '<i class="fas fa-heart"></i> Maybe Yes?',
      '<i class="fas fa-grin-hearts"></i> Just say Yes!',
      '<i class="fas fa-kiss-wink-heart"></i> Please?',
      '<i class="fas fa-heartbeat"></i> Pretty please?',
      '<i class="fas fa-star"></i> With a cherry on top?',
    ];

    const index = Math.min(escapeAttempts - 1, messages.length - 1);
    if (index >= 0) {
      noBtn.innerHTML = messages[index];

      // Gradually change color to match Yes button
      const redValue = Math.min(escapeAttempts * 40, 255);
      const redValue2 = Math.min(escapeAttempts * 30, 255);
      noBtn.style.background = `linear-gradient(to right, rgba(255, ${100 - escapeAttempts * 10}, ${120 - escapeAttempts * 15}, 0.9), rgba(255, ${130 - escapeAttempts * 15}, ${150 - escapeAttempts * 20}, 0.9))`;

      if (escapeAttempts >= 4) {
        noBtn.style.color = "#fff";
      }
    }

    // Make button smaller and harder to catch after many attempts
    if (escapeAttempts >= 5) {
      const scale = Math.max(0.5, 1 - (escapeAttempts - 4) * 0.1);
      noBtn.style.transform = `scale(${scale})`;
    }
  }

  function enhanceYesButton() {
    // Make Yes button grow and glow
    const scale = 1 + escapeAttempts * 0.1;
    yesBtn.style.transform = `scale(${scale})`;

    // Add glow effect
    yesBtn.style.boxShadow = `0 15px 35px rgba(255, 77, 109, ${0.3 + escapeAttempts * 0.1})`;

    // Create hearts around Yes button
    createButtonHearts();
  }

  function createHearts(count) {
    const container = document.querySelector(".floating-hearts");

    for (let i = 0; i < count; i++) {
      const heart = document.createElement("div");
      heart.innerHTML = "❤";
      heart.style.position = "absolute";
      heart.style.color = `rgba(255, 77, 109, ${Math.random() * 0.5 + 0.3})`;
      heart.style.fontSize = `${Math.random() * 30 + 20}px`;
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.top = `${Math.random() * 100}%`;
      heart.style.zIndex = "1";
      heart.style.animation = `floatAround ${Math.random() * 15 + 10}s infinite linear`;
      heart.style.animationDelay = `${Math.random() * 5}s`;

      container.appendChild(heart);
    }
  }

  function createButtonHearts() {
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement("div");
      heart.innerHTML = "❤";
      heart.style.position = "absolute";
      heart.style.color = "#ff4d6d";
      heart.style.fontSize = `${Math.random() * 25 + 15}px`;

      // Position around Yes button
      const yesRect = yesBtn.getBoundingClientRect();
      const containerRect = buttonsContainer.getBoundingClientRect();

      const offsetX = (Math.random() - 0.5) * 100;
      const offsetY = (Math.random() - 0.5) * 100;

      heart.style.left = `${yesRect.left - containerRect.left + yesRect.width / 2 + offsetX}px`;
      heart.style.top = `${yesRect.top - containerRect.top + yesRect.height / 2 + offsetY}px`;
      heart.style.opacity = "0.9";
      heart.style.zIndex = "5";
      heart.style.pointerEvents = "none";
      heart.style.animation = `float 2s ease-out forwards`;

      buttonsContainer.appendChild(heart);

      // Remove heart after animation
      setTimeout(() => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
      }, 2000);
    }
  }

  function createSpecialCelebration() {
    // Add special celebration hearts
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const heart = document.createElement("div");
        heart.innerHTML = "❤";
        heart.style.position = "fixed";
        heart.style.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
        heart.style.fontSize = `${Math.random() * 40 + 20}px`;
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.top = "100vh";
        heart.style.zIndex = "1000";
        heart.style.pointerEvents = "none";
        heart.style.animation = `celebrate ${Math.random() * 3 + 2}s ease-in forwards`;

        document.body.appendChild(heart);

        // Remove heart after animation
        setTimeout(() => {
          if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
          }
        }, 5000);
      }, i * 100);
    }
  }

  function showEscapeMessage(x, y) {
    const messages = [
      "Come on!",
      "Over here!",
      "Try again!",
      "Catch me!",
      "Not so fast!",
      "You can do it!",
      "Click Yes instead!",
    ];

    const message = document.createElement("div");
    message.className = "escape-message";
    message.textContent =
      messages[Math.min(escapeAttempts - 1, messages.length - 1)] ||
      "Yes please!";
    message.style.left = `${x}px`;
    message.style.top = `${y}px`;

    document.body.appendChild(message);

    // Remove message after animation
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 2000);
  }
});
