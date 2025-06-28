"use strict";

(function ($) {
    "use strict";

    // Check if jQuery elements exist
    $.fn.is_exist = function () {
        return this.length > 0;
    };

    $(function () {
        /*--------------------------------------------------------------
        MENU SIDEBAR TOGGLE
        --------------------------------------------------------------*/
        $(".mobile-menu-trigger").on("click", function (e) {
            e.preventDefault();
            $(".menu-block, .menu-overlay").addClass("active");
        });

        $(".menu-close, .menu-overlay").on("click", function () {
            $(".menu-block, .menu-overlay").removeClass("active");
        });

        /*--------------------------------------------------------------
        SUB MENU TOGGLE (.sub-menu)
        Only one .sub-menu visible at a time, closes mega-menu
        --------------------------------------------------------------*/
        $(".nav-item-has-children > a").on("click", function (e) {
            e.preventDefault();

            const $parentItem = $(this).parent(".nav-item-has-children");
            const $subMenu = $parentItem.find(".sub-menu").first();

            // Close all other sub-menus
            $(".sub-menu").not($subMenu).removeClass("show");
            // Also close mega menu submenus
            $(".mega-menu-sub").removeClass("show");

            // Toggle the clicked submenu
            $subMenu.toggleClass("show");
        });

        /*--------------------------------------------------------------
        MEGA MENU HEADER TOGGLE (.mega-menu-sub)
        Only one .mega-menu-sub visible at a time, closes sub-menu
        --------------------------------------------------------------*/
        $(".mega-menu-header").on("click", function (e) {
            e.preventDefault();

            const $clickedMegaMenu = $(this).next(".mega-menu-sub");

            // Close all mega menus except the one clicked
            $(".mega-menu-sub").not($clickedMegaMenu).removeClass("show");
            // Close all dropdown sub-menus
            $(".sub-menu").removeClass("show");

            // Toggle clicked mega menu
            $clickedMegaMenu.toggleClass("show");
        });
    });

})(jQuery);
