document.addEventListener("DOMContentLoaded", (event) => {
    
    // Theme Toggle Logic
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    // Initialize toggle icon
    if (currentTheme === "light") {
        themeToggle.textContent = "🌙";
    } else {
        themeToggle.textContent = "☀️";
    }

    themeToggle.addEventListener("click", () => {
        let theme = document.documentElement.getAttribute("data-theme");
        if (theme === "light") {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "☀️";
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "🌙";
        }
    });

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animations
    const tlHero = gsap.timeline();
    
    tlHero.fromTo(".hero-bg", 
        { scale: 1.1, opacity: 0 }, 
        { scale: 1, opacity: 0.6, duration: 2, ease: "power3.out" }
    )
    .fromTo(".hero-eyebrow",
        { y: -20, opacity: 0},
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out"},
        "-=1.5"
    )
    .fromTo(".hero-title", 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 
        "-=1.2"
    )
    .fromTo(".hero-tagline", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 
        "-=0.8"
    )
    .fromTo(".hero-actions",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
    )
    .fromTo(".hero-stats .stat-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 },
        "-=0.4"
    );

    // Fade up generic animations for cards
    const fadeUpElements = gsap.utils.toArray(".glass-card");
    
    fadeUpElements.forEach(elem => {
        gsap.fromTo(elem,
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                }
            }
        );
    });

    // Parallax background blobs
    gsap.to(".bg-glow-blue", {
        y: 200,
        x: 100,
        scrollTrigger: { scrub: 2 }
    });
    gsap.to(".bg-glow-purple", {
        y: -150,
        x: -100,
        scrollTrigger: { scrub: 2 }
    });
    gsap.to(".bg-glow-cyan", {
        y: -300,
        scrollTrigger: { scrub: 2 }
    });

});
