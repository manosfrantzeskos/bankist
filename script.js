"use strict";

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const operationTabsContainer = document.querySelector(".operations__tab-container");
const operationTabs = document.querySelectorAll(".operations__tab");
const operationsTabsContent = document.querySelectorAll(".operations__content");

const navBar = document.querySelector(".nav");
const navBarHeight = navBar.getBoundingClientRect().height;
const navLinks = document.querySelector(".nav__links");
const mainSections = document.querySelectorAll(".section");

const header = document.querySelector(".header");


const lazyImages = document.querySelectorAll("img[data-src]");

const imagesObserver = new IntersectionObserver(loadLazyImage, {threshold: 0.5});


lazyImages.forEach(img => {
    imagesObserver.observe(img);
    img.classList.add("lazy-img");
});


function loadLazyImage(entries, observer) {
    const [element] = entries;
    const img = element.target;
    const highResolutionImage = img.dataset.src;

    if (element.isIntersecting) {
        img.src = highResolutionImage;
        img.addEventListener("load", () => img.classList.remove("lazy-img"));
        observer.unobserve(img);
    }
}


const sectionsObserver = new IntersectionObserver(displaySection, {threshold: 0.3});

mainSections.forEach(section => {
    sectionsObserver.observe(section)
    // section.classList.add("section--hidden");
});

function displaySection(entries, observer) {
    const [element] = entries;
    const section = element.target;

    if (element.isIntersecting) {
        section.classList.remove("section--hidden");
        observer.unobserve(section);
    }
}

// 

const observer = new IntersectionObserver(makeNavbarSticky, {rootMargin: `-${navBarHeight}px`});
observer.observe(header);

function makeNavbarSticky(entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) {
        navBar.classList.add("sticky");
    }
    else {
        navBar.classList.remove("sticky");
    }
}


function changeNavLinksOpacity(event) {
    const linkHovered = event.target;
    const linkSiblings = linkHovered.closest(".nav__links").querySelectorAll(".nav__link");
    const opacity = this;

    linkSiblings.forEach(link => {
        if (link !== linkHovered) {
            link.style.opacity = opacity;
        }
    });
}


navLinks.addEventListener("mouseover", changeNavLinksOpacity.bind(0.5));
navLinks.addEventListener("mouseout", changeNavLinksOpacity.bind(1));


operationTabsContainer.addEventListener("click", event => {
    const operation = event.target.closest(".operations__tab");

    if (operation) {
        const tab = operation.getAttribute("data-tab");
        const content = document.querySelector(`.operations__content--${tab}`);

        operationTabs.forEach(tab => tab.classList.remove("operations__tab--active"));
        operationsTabsContent.forEach(text => text.classList.remove("operations__content--active"));

        operation.classList.add("operations__tab--active");
        content.classList.add("operations__content--active");
    }
});


// const featuresSectionPosition = featuresSection.getBoundingClientRect().y;

// window.addEventListener("scroll", () => {

//     if (window.scrollY > featuresSectionPosition) {
//         navBar.classList.add("sticky");
//     } 
//     else {
//         navBar.classList.remove("sticky");
//     }
// });


function openModal(event) {
    event.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};


function closeModal() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};


btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// Implement Smooth Scrolling
const btnScrollTo = document.querySelector(".btn--scroll-to");
const scrollToElem = document.querySelector("#section--1");

btnScrollTo.addEventListener("click", () => {
    const elemRelativeYPos = scrollToElem.getBoundingClientRect().top;
    const elemRelativeXPos = scrollToElem.getBoundingClientRect().left;

    window.scrollTo({
        top: elemRelativeYPos + window.pageYOffset,
        left: elemRelativeXPos + window.pageXOffset,
        behavior: "smooth"
    });
});


navLinks.addEventListener("click", function (event) {
    event.preventDefault();
    const linkID = event.target.getAttribute("href");

    if (linkID && linkID !== "#") {
        document.querySelector(linkID).scrollIntoView({ behavior: "smooth" });
    }
});

const sliderBtnLeft  = document.querySelector(".slider__btn--left");
const sliderBtnRight = document.querySelector(".slider__btn--right");
const sliderSlides   = document.querySelectorAll(".slide");
const numOfSlides = sliderSlides.length;
const dotsContainer = document.querySelector(".dots");
let currentSlide = 0;


sliderSlides.forEach((slide, i) => {
    slide.style.transform = `translateX(${i * 100}%)`;
    generateSlideDot(i);
});


dotsContainer.addEventListener("click", event => {
    const element = event.target;

    if (element.classList.contains("dots__dot")) {
        const slide = +element.dataset.slide;
        currentSlide = slide;
        goToSlide(currentSlide);
        styleActiveDot(currentSlide);
    }
});


function styleActiveDot(slide) {

    dotsContainer
        .querySelector(".dots__dot--active")
        .classList
        .remove("dots__dot--active");

    dotsContainer
        .querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList
        .add("dots__dot--active");
}


function generateSlideDot(slide) {

    const active = slide ? "" : "dots__dot--active";
    
    dotsContainer.insertAdjacentHTML(
        "beforeend", 
        `<button type="button" class="dots__dot ${active}" data-slide=${slide}></button>`
    );
}


function goToSlide(slide) {
    sliderSlides.forEach((s, i) => {
        s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
    styleActiveDot(slide);
}


function nextSlide() {

    if (currentSlide === numOfSlides - 1) {
        currentSlide = 0;
    }
    else {
        currentSlide++;
    }

    goToSlide(currentSlide);
}


function prevSlide() {

    if (currentSlide === 0) {
        currentSlide = numOfSlides - 1;
    }
    else {
        currentSlide--;
    }

    goToSlide(currentSlide);
}


sliderBtnRight.addEventListener("click", nextSlide);
sliderBtnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") nextSlide();
    if (event.key === "ArrowLeft") prevSlide();
});
