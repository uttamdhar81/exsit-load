"use strict";

/*--------------------------------------------------------------
    [TABLE OF CONTENTS]
    --------------------------------------------------------------
    01. CUSTOM UTILITIES
    02. PRELOADER
    03. HEADER SCROLL
    04. SIDEBAR TOGGLE
    05. MENU SUBMENU TOGGLE
    06. SCROLL TO TOP (ARROW)
    07. SPLIDE SLIDERS
        - Testimonial Carousel
        - Feedback Carousel
        - Autoscroll Carousel
        - Counter Carousel with Counter Display
        - Vertical Carousel with Active States
        - Four Column Slider (Multiple IDs)
        - Main & Thumbnail Carousel Sync
    08. JQUERY COUNTER ANIMATION
    09. AOS INIT
    10. GLIGHTBOX INIT
-------------------------------------------------------------------*/

/*----------------------------------------------------------
    01. CUSTOM UTILITIES
------------------------------------------------------------*/
(function ($) {
    // Custom jQuery Utilities
    $.fn.is_exist = function () {
        return this.length > 0;
    };

    $(function () {
        /*----------------------------------------------------------
            02. PRELOADER
        ------------------------------------------------------------*/
        $(window).on('load', function () {
            $('.preloader').fadeOut('200', function () {
                $(this).remove();
            });
        });

        /*----------------------------------------------------------
            03. HEADER SCROLL
        ------------------------------------------------------------*/
        function handleScroll() {
            var $headerWrapper = $(".header-wrapper");
            if ($headerWrapper.length) {
                var upperHeaderHeight = $(".upper-header").length ? $(".upper-header").outerHeight() : 0;

                if ($(window).scrollTop() > upperHeaderHeight) {
                    $headerWrapper.addClass("scroll-header");
                } else {
                    $headerWrapper.removeClass("scroll-header");
                }
            }
        }
        $(window).on("scroll", handleScroll);
        handleScroll();

        /*----------------------------------------------------------
            04. SIDEBAR TOGGLE
        ------------------------------------------------------------*/
        $(".mobile-menu-trigger").on("click", function (e) {
            e.preventDefault();
            $(".menu-block, .menu-overlay").addClass("active");
        });
        $(".menu-close, .menu-overlay").on("click", function () {
            $(".menu-block, .menu-overlay").removeClass("active");
        });

        /*----------------------------------------------------------
            05. MENU SUBMENU TOGGLE
        ------------------------------------------------------------*/
        $(".nav-item-has-children > a").on("click", function (e) {
            e.preventDefault();
            const $parent = $(this).parent();
            const $submenu = $parent.find(".sub-menu").first();
            $(".sub-menu").not($submenu).removeClass("show");
            $(".mega-menu-sub").removeClass("show");
            $submenu.toggleClass("show");
        });
        $(".mega-menu-header").on("click", function (e) {
            e.preventDefault();
            const $mega = $(this).next(".mega-menu-sub");
            $(".mega-menu-sub").not($mega).removeClass("show");
            $(".sub-menu").removeClass("show");
            $mega.toggleClass("show");
        });

        /*----------------------------------------------------------
            06. SCROLL TO TOP (ARROW)
        ------------------------------------------------------------*/
        const progressPath = document.querySelector('.arrow-round-wrap path');
        const arrowWrap = document.querySelector('.arrow-round-wrap');

        if (progressPath && arrowWrap) {
            const pathLength = progressPath.getTotalLength();
            progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.style.transition = 'stroke-dashoffset 10ms linear';

            const updateProgress = () => {
                const scroll = window.scrollY;
                const height = document.documentElement.scrollHeight - window.innerHeight;
                const progress = pathLength - (scroll * pathLength / height);
                progressPath.style.strokeDashoffset = progress;
                arrowWrap.classList.toggle('active-arrow', scroll > 50);
            };

            updateProgress();
            window.addEventListener('scroll', updateProgress);
            arrowWrap.addEventListener('click', e => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        /*----------------------------------------------------------
            07. SPLIDE SLIDERS
        ------------------------------------------------------------*/
        if (typeof Splide === 'function') {
            const mountSplide = (selector, options, extensions) => {
                const el = document.querySelector(selector);
                if (el) {
                    const instance = new Splide(el, options);
                    if (extensions) instance.mount(extensions);
                    else instance.mount();
                }
            };

            // Testimonial Carousel
            mountSplide('#testimonial-carousel', {
                type: 'fade', perPage: 1, arrows: true, pagination: true
            });

            // Feedback Carousel
            mountSplide('#feedback-carousel', {
                type: 'loop', perPage: 3, gap: 15, arrows: true, pagination: true,
                breakpoints: { 1024: { perPage: 2 }, 768: { perPage: 1 } }
            });

            // Autoscroll Carousel
            mountSplide('#autoscroll-carousel', {
                type: 'loop', drag: 'free', focus: 'center', perPage: 6, pagination: false,
                breakpoints: { 1024: { perPage: 6 }, 768: { perPage: 4 }, 480: { perPage: 2 } },
                autoScroll: { speed: 1 }
            }, window.splide.Extensions);

            // Counter Carousel with Dynamic Counter
            const connterEl = document.querySelector('#counter-carousel');
            if (connterEl) {
                const counterSplide = new Splide(connterEl, {
                    type: 'loop',
                    perPage: 1,
                    autoplay: true,
                    pauseOnHover: true,
                    arrows: true,
                    pagination: false,
                });

                let counterWrapper = connterEl.querySelector('.counter-carousel-counter');
                let counterSpan;

                counterSplide.on('mounted', () => {
                    const totalSlides = counterSplide.length;

                    if (!counterWrapper) {
                        counterWrapper = document.createElement('div');
                        counterWrapper.className = 'counter-carousel-counter';

                        counterSpan = document.createElement('span');
                        counterSpan.className = 'display4-size pe-1';
                        counterSpan.textContent = '1';

                        counterWrapper.appendChild(counterSpan);
                        counterWrapper.append(`/${totalSlides}`);

                        connterEl.appendChild(counterWrapper);
                    } else {
                        counterSpan = counterWrapper.querySelector('span.display4-size');
                    }

                    if (counterSpan) {
                        counterSpan.textContent = counterSplide.index + 1;
                    }
                });

                counterSplide.on('move', () => {
                    if (counterSpan) {
                        counterSpan.textContent = counterSplide.index + 1;
                    }
                });

                counterSplide.mount();
            }

            // Vertical Carousel
            const vertical = document.querySelector('#vertical-carousel');
            if (vertical) {
                const verticalSplide = new Splide(vertical, {
                    direction: 'ttb', height: '140px', perPage: 3, perMove: 1, autoplay: true,
                    interval: 3000, arrows: false, pagination: true, drag: false
                });

                verticalSplide.on('mounted move', () => {
                    document.querySelectorAll('.splide__slide')
                        .forEach(slide => slide.classList.remove('slider-active', 'slider-active-1', 'slider-active-2'));

                    const slides = verticalSplide.Components.Slides.get();
                    const [a, b, c] = [0, 1, 2].map(i => slides[(verticalSplide.index + i) % slides.length]);
                    if (a) a.slide.classList.add('slider-active-2');
                    if (b) b.slide.classList.add('slider-active-1');
                    if (c) c.slide.classList.add('slider-active');
                });

                verticalSplide.mount();
            }

            // Four Column Carousel (Multiple)
            const dir = localStorage.getItem('direction') === 'rtl' ? 'rtl' : 'ltr';
            document.querySelectorAll('.four-slider').forEach(el => {
                new Splide(`#${el.id}`, {
                    type: 'loop', autoplay: true, gap: 10, perPage: 4, direction: dir,
                    breakpoints: { 1024: { perPage: 3 }, 768: { perPage: 2 }, 480: { perPage: 1 } }
                }).mount();
            });

            // Main + Thumbnail Carousel
            const mainCarousel = document.querySelector('#main-carousel');
            const thumbsCarousel = document.querySelector('#thumbnail-carousel');

            if (mainCarousel && thumbsCarousel) {
                const main = new Splide(mainCarousel, {
                    type: 'fade', rewind: true, perPage: 1, autoplay: true,
                    pauseOnHover: true, interval: 5000, direction: dir,
                    arrows: false, pagination: false, speed: 1000
                });

                const thumbs = new Splide(thumbsCarousel, {
                    gap: 20, perPage: 3, rewind: true, pagination: false, isNavigation: true,
                    direction: dir,
                    breakpoints: { 1024: { perPage: 3 }, 768: { perPage: 2 }, 480: { perPage: 1 } }
                });

                main.sync(thumbs).mount();
                thumbs.mount();
            }
        }

        /*----------------------------------------------------------
            08. JQUERY COUNTER ANIMATION
        ------------------------------------------------------------*/
        const $counterSection = $('#exsit-counter');
        if ($counterSection.length && typeof $ === 'function') {
            let animated = false;
            $(window).on('scroll', function () {
                const offset = $counterSection.offset().top - window.innerHeight;
                if (!animated && $(window).scrollTop() > offset) {
                    $('.exsit-counter').each(function () {
                        const $el = $(this);
                        const target = parseFloat($el.data('percentage'));
                        $({ countNum: 0 }).animate({ countNum: target }, {
                            duration: 2000,
                            step: function (now) {
                                $el.text(Number.isInteger(target) ? Math.floor(now) : now.toFixed(1));
                            },
                            complete: function () {
                                $el.text(target);
                            }
                        });
                    });
                    animated = true;
                }
            });
        }

        /*----------------------------------------------------------
            09. AOS INIT
        ------------------------------------------------------------*/
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 800, once: true });
        }

        /*----------------------------------------------------------
            10. GLIGHTBOX INIT
        ------------------------------------------------------------*/
        const lightbox = GLightbox({
            selector: '.glightbox'
        });
    });
})(jQuery);
