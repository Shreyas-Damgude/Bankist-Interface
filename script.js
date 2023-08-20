'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const slideRight = document.querySelector('.slider__btn--right');
const slideLeft = document.querySelector('.slider__btn--left');
const slides = document.querySelectorAll('.slide');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
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

//Smooth Scroll
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

tabsContainer.addEventListener('click', function (e) {
  let clicked = e.target.closest('.operations__tab');
  let data = clicked.getAttribute('data-tab');
  if (!clicked) return;
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(con =>
    con.classList.remove('operations__content--active')
  );
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${data}`)
    .classList.add('operations__content--active');
});

function fade(e) {
  if (e.target.classList.contains('nav__link')) {
    let siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
    let logo = e.target.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== e.target) {
        el.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
}

nav.addEventListener('mouseover', fade.bind(0.5));
nav.addEventListener('mouseout', fade.bind(1));

let navHeight = nav.getBoundingClientRect().height;

function stickyNav(entries) {
  let [entry] = entries;
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
}

let headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//Reveal sections
let allSections = document.querySelectorAll('.section');

function revealSection(entries, observer) {
  let [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}
let sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (sec) {
  sectionObserver.observe(sec);
  allSections.forEach(sec => sec.classList.add('section--hidden'));
});

//Images
let images = document.querySelectorAll('img[data-src]');

function loadImg(entries, observer) {
  let [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}

let imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

images.forEach(img => imgObserver.observe(img));

//Slider
function slider() {
  let currentSlide = 0;
  let maxSilde = slides.length;
  let dotContainer = document.querySelector('.dots');

  function createDots() {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  function goToSlide(slideNum) {
    slides.forEach(function (s, i) {
      s.style.transform = `translate(${100 * (i - slideNum)}%)`;
    });
  }

  function activateDots(slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  function init() {
    goToSlide(0);
    createDots();
    activateDots(0);
  }

  init();

  function nextSlide() {
    if (currentSlide === maxSilde - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDots(currentSlide);
  }

  function prevSlide() {
    if (currentSlide === 0) {
      currentSlide = maxSilde - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDots(currentSlide);
  }

  slideRight.addEventListener('click', nextSlide);

  slideLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      let { slide } = e.target.dataset;
      goToSlide(slide);
      activateDots(slide);
    }
  });
}

slider();
