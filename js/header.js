// Collapse button on responsive menu
const toggler = document.querySelector('.navbar-toggler');
const collapse = document.querySelector('.collapse');
const navLinks = document.querySelectorAll(".nav-link");

// Toggle menu on button click
toggler.addEventListener('click', () => {
    collapse.classList.toggle('show');
});

// Close menu when a nav item is clicked (only on small screens)
navLinks.forEach(link => {
    link.addEventListener("click", function() {
        if (window.innerWidth < 992) { // Only collapse on small screens
            collapse.classList.remove('show');
        }
    });
});

// Change active link on scroll
document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll("section");

    function changeActiveLink() {
        let currentSection = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 50;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active-btn");
            if (link.getAttribute("href").substring(1) === currentSection) {
                link.classList.add("active-btn");
            }
        });
    }

    // Highlight active menu item on click
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            navLinks.forEach(item => item.classList.remove("active-btn"));
            this.classList.add("active-btn");
        });
    });

    // Update active link on scroll
    window.addEventListener("scroll", changeActiveLink);
    changeActiveLink();
});