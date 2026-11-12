// =====================================================
// Saffron Table - script.js
// =====================================================

// ---------- 1. Mobile hamburger menu ----------
const menuBtn = document.querySelector("#menuBtn");
const navLinks = document.querySelector("#navLinks");

menuBtn.addEventListener("click", function () {
  const isOpen = navLinks.classList.toggle("open");
  menuBtn.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen);
});

navLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// ---------- 2. Modal popup ----------
const modal = document.querySelector("#modal");

function openModal() { modal.classList.add("show"); }
function closeModal() { modal.classList.remove("show"); }

document.querySelector("#openModal").addEventListener("click", openModal);
document.querySelector("#heroBtn").addEventListener("click", openModal);
document.querySelector("#closeModal").addEventListener("click", closeModal);

modal.addEventListener("click", function (event) {
  if (event.target === modal) closeModal();   // click on the dark background
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeModal();
});

// buttons that scroll to a section
function scrollToSection(id) {
  document.querySelector(id).scrollIntoView({ behavior: "smooth" });
}
document.querySelector("#modalReserve").addEventListener("click", function () {
  closeModal();
  scrollToSection("#reserve");
});
document.querySelector("#signatureBtn").addEventListener("click", function () { scrollToSection("#menu"); });
document.querySelector("#experienceBtn").addEventListener("click", function () { scrollToSection("#reserve"); });

// ---------- 3. Contact / reservation form validation ----------
const form = document.querySelector("#contactForm");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const dateInput = document.querySelector("#date");
const messageInput = document.querySelector("#message");
const success = document.querySelector("#formSuccess");

// the date cannot be in the past
dateInput.min = new Date().toISOString().split("T")[0];

function showError(input, errorId, text) {
  document.querySelector(errorId).textContent = text;
  input.classList.remove("invalid");
  void input.offsetWidth;                 // restarts the shake animation
  input.classList.add("invalid");
}

function clearError(input, errorId) {
  document.querySelector(errorId).textContent = "";
  input.classList.remove("invalid");
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  success.textContent = "";
  let isValid = true;

  if (nameInput.value.trim().length < 2) {
    showError(nameInput, "#nameError", "Please enter your name (at least 2 letters).");
    isValid = false;
  } else {
    clearError(nameInput, "#nameError");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value.trim())) {
    showError(emailInput, "#emailError", "Please enter a valid email, like you@example.com.");
    isValid = false;
  } else {
    clearError(emailInput, "#emailError");
  }

  if (dateInput.value === "" || dateInput.value < dateInput.min) {
    showError(dateInput, "#dateError", "Please choose today or a future date.");
    isValid = false;
  } else {
    clearError(dateInput, "#dateError");
  }

  if (messageInput.value.trim().length < 10) {
    showError(messageInput, "#messageError", "Your message must be at least 10 characters.");
    isValid = false;
  } else {
    clearError(messageInput, "#messageError");
  }

  if (isValid) {
    success.textContent = "Thank you, " + nameInput.value.trim() + "! Your table request was sent.";
    form.reset();
  }
});

// ---------- 4. Hero image slider ----------
const slides = document.querySelectorAll(".slide");
const dotsBox = document.querySelector("#dots");
let currentSlide = 0;
let slideTimer;

// make one dot for each slide
slides.forEach(function (slide, index) {
  const dot = document.createElement("button");
  dot.className = "dot";
  dot.setAttribute("aria-label", "Show photo " + (index + 1));
  dot.addEventListener("click", function () { showSlide(index); });
  dotsBox.appendChild(dot);
});
const dots = dotsBox.querySelectorAll(".dot");

function showSlide(index) {
  slides[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");
  currentSlide = (index + slides.length) % slides.length;   // goes back to 0 at the end
  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
  restartTimer();
}

function restartTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(function () { showSlide(currentSlide + 1); }, 6000);
}

document.querySelector("#nextSlide").addEventListener("click", function () { showSlide(currentSlide + 1); });
document.querySelector("#prevSlide").addEventListener("click", function () { showSlide(currentSlide - 1); });

dots[0].classList.add("active");
restartTimer();

// ---------- 5. Headline: words rise one by one ----------
const title = document.querySelector("#heroTitle");
const words = title.textContent.split(" ");
title.textContent = "";
words.forEach(function (word, index) {
  const wrap = document.createElement("span");
  wrap.className = "word-wrap";
  const inner = document.createElement("span");
  inner.className = "word";
  inner.style.setProperty("--i", index);
  inner.textContent = word;
  wrap.appendChild(inner);
  title.appendChild(wrap);
  title.appendChild(document.createTextNode(" "));
});

// ---------- 6. Floating gold dust in the hero ----------
const dust = document.querySelector("#goldDust");
for (let i = 0; i < 28; i++) {
  const speck = document.createElement("span");
  const size = 2 + Math.random() * 4;
  speck.style.width = size + "px";
  speck.style.height = size + "px";
  speck.style.left = Math.random() * 100 + "%";
  speck.style.animationDuration = 8 + Math.random() * 10 + "s";
  speck.style.animationDelay = Math.random() * 10 + "s";
  dust.appendChild(speck);
}

// ---------- 7. Moving photo strips: copy the photos so the loop never ends ----------
document.querySelectorAll(".track").forEach(function (track) {
  const photos = Array.from(track.children);
  photos.forEach(function (photo) {
    const copy = photo.cloneNode(true);
    copy.alt = "";
    copy.setAttribute("aria-hidden", "true");
    track.appendChild(copy);
  });
});

// ---------- 8. Menu tabs (cards are built from an array) ----------
const IMG = "https://images.unsplash.com/photo-";
const menuItems = {
  starters: [
    { name: "Garden salad", text: "Fresh greens, herbs and a light lemon dressing.", price: "$9", img: "1546069901-ba9599a7e63c", alt: "Fresh salad bowl with vegetables" },
    { name: "Egg on toast", text: "Soft egg, warm toast and seasonal greens.", price: "$8", img: "1482049016688-2d3e1b311543", alt: "Toast with egg and greens" },
    { name: "Pan-seared fish", text: "Crisp skin, saffron butter and herbs.", price: "$13", img: "1519708227418-c8fd9a32b7a2", alt: "Fish dish with garnish" }
  ],
  mains: [
    { name: "Fire-grilled steak", text: "Served with saffron rice and roasted vegetables.", price: "$24", img: "1600891964092-4316c288032e", alt: "Grilled steak with vegetables" },
    { name: "Creamy pasta", text: "Fresh pasta with herbs and a rich sauce.", price: "$16", img: "1621996346565-e3dbc646d9a9", alt: "Creamy pasta on a plate" },
    { name: "Slow-cooked ribs", text: "Eight hours over low heat, glazed with honey.", price: "$22", img: "1544025162-d76694265947", alt: "Slow-cooked meat with sides" }
  ],
  desserts: [
    { name: "Chocolate cake", text: "Dark, soft and a little bit dangerous.", price: "$9", img: "1578985545062-69928b1d9587", alt: "Chocolate cake" },
    { name: "Dessert glasses", text: "Three small sweets for sharing.", price: "$11", img: "1551024506-0bccd828d307", alt: "Small desserts in glasses" }
  ]
};

const menuGrid = document.querySelector("#menuGrid");
const tabs = document.querySelectorAll(".tab");

function showMenu(category) {
  menuGrid.innerHTML = "";
  menuItems[category].forEach(function (item, index) {
    const card = document.createElement("article");
    card.className = "dish";
    card.style.setProperty("--i", index);

    const imgBox = document.createElement("div");
    imgBox.className = "dish-img";
    const img = document.createElement("img");
    img.src = IMG + item.img + "?auto=format&fit=crop&w=700&q=70";
    img.alt = item.alt;
    imgBox.appendChild(img);

    const info = document.createElement("div");
    info.className = "dish-info";
    const h3 = document.createElement("h3");
    h3.textContent = item.name;
    const p = document.createElement("p");
    p.textContent = item.text;
    const price = document.createElement("span");
    price.className = "price";
    price.textContent = item.price;
    info.append(h3, p, price);

    card.append(imgBox, info);
    addTilt(card);
    menuGrid.appendChild(card);
  });
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    tabs.forEach(function (t) { t.classList.remove("active"); });
    tab.classList.add("active");
    showMenu(tab.dataset.cat);
  });
});

// cards tilt toward the mouse
function addTilt(card) {
  card.addEventListener("mousemove", function (event) {
    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    card.style.transform = "rotateY(" + x * 10 + "deg) rotateX(" + -y * 10 + "deg) translateY(-6px)";
  });
  card.addEventListener("mouseleave", function () {
    card.style.transform = "";
  });
}

showMenu("starters");

// ---------- 9. Reviews slider ----------
const reviews = document.querySelectorAll(".review");
const reviewDots = document.querySelector("#reviewDots");
let currentReview = 0;
let reviewTimer;

reviews.forEach(function (review, index) {
  const dot = document.createElement("button");
  dot.className = "dot";
  dot.setAttribute("aria-label", "Show review " + (index + 1));
  dot.addEventListener("click", function () { showReview(index); });
  reviewDots.appendChild(dot);
});
const rDots = reviewDots.querySelectorAll(".dot");

function showReview(index) {
  reviews[currentReview].classList.remove("active");
  rDots[currentReview].classList.remove("active");
  currentReview = (index + reviews.length) % reviews.length;
  reviews[currentReview].classList.add("active");
  rDots[currentReview].classList.add("active");
  clearInterval(reviewTimer);
  reviewTimer = setInterval(function () { showReview(currentReview + 1); }, 5000);
}
showReview(0);

// ---------- 10. Scroll effects ----------
const header = document.querySelector("#header");
const progress = document.querySelector("#progress");
const parallaxImages = document.querySelectorAll(".parallax");

window.addEventListener("scroll", function () {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;

  header.classList.toggle("scrolled", scrolled > 60);
  progress.style.width = (scrolled / total) * 100 + "%";

  // photos move slower than the page
  parallaxImages.forEach(function (img) {
    const box = img.getBoundingClientRect();
    const offset = (box.top - window.innerHeight / 2) * -0.06;
    img.style.objectPosition = "50% " + (50 + offset) + "%";
  });
});

// ---------- 11. Reveal on scroll + number counters ----------
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      entry.target.querySelectorAll(".count").forEach(runCounter);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal").forEach(function (el) { observer.observe(el); });

function runCounter(counter) {
  const target = Number(counter.dataset.target);
  const steps = 60;
  let step = 0;
  const timer = setInterval(function () {
    step++;
    counter.textContent = Math.round((target * step) / steps).toLocaleString("en-US");
    if (step === steps) clearInterval(timer);
  }, 25);
}

// ---------- 12. Soft light that follows the mouse ----------
const glow = document.querySelector("#glow");
document.addEventListener("mousemove", function (event) {
  glow.style.opacity = 1;
  glow.style.transform = "translate(" + event.clientX + "px, " + event.clientY + "px)";
});
