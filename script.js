// ===================== TYPED ANIMATION =====================
(function() {
    const el = document.getElementById("heroTyped");
    if (!el) return;

    const words = ["Game Designer", "Level Designer", "System Designer"];
    const TYPE_SPEED = 60; // ms per character while typing
    const DELETE_SPEED = 35; // ms per character while deleting
    const PAUSE_AFTER = 2200; // ms to hold the full word
    const PAUSE_BEFORE = 400; // ms pause before typing next word

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
        const current = words[wordIndex];

        if (!isDeleting) {
            // typing forward
            el.textContent = current.slice(0, charIndex + 1);
            charIndex++;

            if (charIndex === current.length) {
                // finished typing — pause then start deleting
                isDeleting = true;
                setTimeout(tick, PAUSE_AFTER);
                return;
            }
            setTimeout(tick, TYPE_SPEED);

        } else {
            // deleting
            el.textContent = current.slice(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                // finished deleting — move to next word
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(tick, PAUSE_BEFORE);
                return;
            }
            setTimeout(tick, DELETE_SPEED);
        }
    }

    // kick off after a short initial delay
    setTimeout(tick, 800);
})();

// ===================== FADE IN =====================
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
    });
}, { threshold: 0.1 });

document.querySelectorAll(".fade-in").forEach(el => sectionObserver.observe(el));


// ===================== CAROUSEL =====================
const track = document.getElementById("carouselTrack");
const slides = track ? Array.from(track.querySelectorAll(".carousel-slide")) : [];
const thumbItems = Array.from(document.querySelectorAll(".thumb-item"));
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

let currentIndex = 0;
let isDragging = false;
let startX = 0;
let dragDelta = 0;
let isAnimating = false;

function goTo(index) {
    if (isAnimating || !slides.length) return;
    const total = slides.length;

    // Infinite loop wrap
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;

    currentIndex = index;

    // Each slide is 100% of .carousel-viewport width.
    // translate by: currentIndex × 100% (of the track's own width = 1 slide width)
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update active states
    slides.forEach((s, i) => s.classList.toggle("is-active", i === currentIndex));
    thumbItems.forEach((t, i) => t.classList.toggle("active", i === currentIndex));

    // Scroll active thumb into view
    if (thumbItems[currentIndex]) {
        thumbItems[currentIndex].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });
    }

    // Brief lock to prevent double-fire during CSS transition
    isAnimating = true;
    setTimeout(() => { isAnimating = false; }, 750);

    // Play video on active slide, pause on others
    slides.forEach((s, i) => {
        const vid = s.querySelector(".slide-video");
        if (!vid) return;
        if (i === currentIndex) {
            vid.play().catch(() => {}); // autoplay may need user gesture on some browsers
        } else {
            vid.pause();
        }
    });
}

// Init
if (slides.length) goTo(0);

// Buttons
if (btnPrev) btnPrev.addEventListener("click", () => goTo(currentIndex - 1));
if (btnNext) btnNext.addEventListener("click", () => goTo(currentIndex + 1));

// Thumbnail clicks
thumbItems.forEach(thumb => {
    thumb.addEventListener("click", () => {
        goTo(parseInt(thumb.getAttribute("data-index"), 10));
    });
});

// Keyboard
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") goTo(currentIndex - 1);
    if (e.key === "ArrowRight") goTo(currentIndex + 1);
});


// ===================== DRAG / SWIPE =====================
if (track) {
    track.addEventListener("mousedown", e => {
        isDragging = true;
        startX = e.clientX;
        dragDelta = 0;
        track.classList.add("is-dragging");
    });

    window.addEventListener("mousemove", e => {
        if (!isDragging) return;
        dragDelta = e.clientX - startX;
    });

    window.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove("is-dragging");
        const t = 60;
        if (dragDelta < -t) goTo(currentIndex + 1);
        else if (dragDelta > t) goTo(currentIndex - 1);
        else goTo(currentIndex);
        dragDelta = 0;
    });

    track.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
        dragDelta = 0;
    }, { passive: true });

    track.addEventListener("touchmove", e => {
        dragDelta = e.touches[0].clientX - startX;
    }, { passive: true });

    track.addEventListener("touchend", () => {
        const t = 50;
        if (dragDelta < -t) goTo(currentIndex + 1);
        else if (dragDelta > t) goTo(currentIndex - 1);
        dragDelta = 0;
    });

    // Prevent accidental link activation while dragging
    track.addEventListener("click", e => {
        if (Math.abs(dragDelta) > 10) e.preventDefault();
    }, true);
}

window.addEventListener("resize", () => goTo(currentIndex));


// ===================== PAGE TRANSITION =====================
const transition = document.querySelector(".page-transition");

window.addEventListener("load", () => {
    if (transition) {
        transition.style.opacity = "1";
        setTimeout(() => {
            transition.style.opacity = "0";
            transition.style.pointerEvents = "none";
        }, 100);
    }
});

document.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute("href");
    if (
        href &&
        !href.startsWith("#") &&
        !href.startsWith("http") &&
        !href.startsWith("mailto") &&
        !link.hasAttribute("target")
    ) {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            if (transition) {
                transition.style.opacity = "1";
                transition.style.pointerEvents = "all";
                setTimeout(() => { window.location.href = href; }, 400);
            }
        });
    }
});