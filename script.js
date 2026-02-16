// FADE IN SECTION

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }

    });
}, {
    threshold: 0.1
});

document.querySelectorAll(".fade-in").forEach((el) => {
    sectionObserver.observe(el);
});



// STAGGER PROJECT CARDS

const projectObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const cards = entry.target.querySelectorAll(".project-card");

            cards.forEach((card, index) => {

                setTimeout(() => {
                    card.classList.add("visible");
                }, index * 150); // delay antar card

            });

        }

    });

}, {
    threshold: 0.2
});

const projectsSection = document.querySelector(".projects");

if (projectsSection) {
    projectObserver.observe(projectsSection);
}

// PAGE TRANSITION ELEMENT
const transition = document.querySelector(".page-transition");


// FADE IN saat page load
window.addEventListener("load", () => {

    if (transition) {

        transition.style.opacity = "1";

        setTimeout(() => {
            transition.style.opacity = "0";
            transition.style.pointerEvents = "none";
        }, 100);

    }

});


// TRANSITION saat klik link
document.querySelectorAll("a").forEach(link => {

    const href = link.getAttribute("href");

    if (
        href &&
        !href.startsWith("#") &&
        !href.startsWith("http") &&
        !link.hasAttribute("target")
    ) {

        link.addEventListener("click", function(e) {

            e.preventDefault();

            if (transition) {

                transition.style.opacity = "1";
                transition.style.pointerEvents = "all";

                setTimeout(() => {
                    window.location.href = href;
                }, 400);

            }

        });

    }

});