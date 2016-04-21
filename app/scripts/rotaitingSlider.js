(function() {
  var rotatingSlider = function(selector, options) {

    function initSingleSlider($el, options) {
      var $slider, $rotaters,
          $handle, $handleItems,
          numOfItems,
          angle, currentAngle = 0,
          prefix = ".slider3d__",
          handlePrefix = prefix + "handle__",
          rotating = false,
          k=1;

      var defaultOptions = {
        xRotation: false,
        speed: 1100,
        dragSpeedCoef: 0.7,
        handleSpeedCoef: 6,
        easing: "ease",
        persMult: 1.6,
        handlePersMult: 3,
        scrollRotation: true,
        keysRotation: false,
        globalDragRotation: false,
        withControls: false,
        handleAndGlobalDrag: false,
        allowDragDuringAnim: false,
        allowScrollDuringAnim: false,
        allowKeysDuringAnim: false,
        allowControlsDuringAnim: false
      };

      var __opts = $.extend(defaultOptions, options);

      var axis = (__opts.xRotation) ? "Y" : "X";
      var angleMult = (__opts.xRotation) ? 1 : -1;

      function handleActiveItem() {
        if (!__opts.withControls) return;
        $handleItems.removeClass("active");
        var a = currentAngle % 360 / angle;
        if (a < 0) a = numOfItems + a;
        if (a > 0) a = a + 1;
        if (!a) a = 1;
        $handleItems.eq(a - 1).addClass("active");
      };

      function rotateSlider(delta) {
        var newAngle = currentAngle + delta * angle;

        $rotaters.css({"transform": "rotate"+axis+"("+ (newAngle * angleMult * -1) +"deg)",
                       "transition": "transform " + __opts.speed / 1000 + "s " + __opts.easing});
        currentAngle = newAngle;



        setTimeout(function() {
          $rotaters.css("transition", "transform 0s");
          handleActiveItem();
          rotating = false;
        }, __opts.speed);


      };

      function navigateUp() {
        rotateSlider(-1);
        $(".up").css( "transform", "translateY(0%)");
        k--;
        if(k==0){
            k=4;
        }
          rotsl();
      };

      function navigateDown() {
        rotateSlider(1);
        $(".down").css( "transform", "translateY(0%)");
        k++;
        if(k==5){
            k=1;
        }
          rotsl();
      };

      function scrollHandler(e) {
        if (rotating && !__opts.allowScrolluringAnim) return;
        rotating = true;
        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
        if (delta > 0) {
          navigateUp();
        } else if (delta < 0) {
          navigateDown();
        }
      };

        function rotsl(){
           // alert(k);
        switch (k) {
          case 1:
            $(".r4").addClass("up");
            $(".r2").addClass("down");

            $(".r1").removeClass("up");
            $(".r3").removeClass("down");

            $(".r3").removeClass("up");
            $(".r1").removeClass("down");

            break;
          case 2:
            $(".r1").addClass("up");
            $(".r3").addClass("down");

            $(".r4").removeClass("up");
            $(".r2").removeClass("down");

            $(".r2").removeClass("up");
            $(".r4").removeClass("down");
            break;
          case 3:
            $(".r2").addClass("up");
            $(".r4").addClass("down");

            $(".r1").removeClass("up");
            $(".r3").removeClass("down");

            $(".r3").removeClass("up");
            $(".r1").removeClass("down");
            break;
          case 4:
            $(".r3").addClass("up");
            $(".r1").addClass("down");

            $(".r2").removeClass("up");
            $(".r4").removeClass("down");

            $(".r4").removeClass("up");
            $(".r2").removeClass("down");
            break;
        }
            $(".up").css( "transform", "translateY(-60%)");
            $(".down").css( "transform", "translateY(60%)");

        }

      function initControls() {
        var $controls = $(prefix + "controls");
        $handle = $(prefix + "handle", $slider);
        var $handleInner = $(handlePrefix + "inner", $handle);
        $handleItems = $(handlePrefix + "item", $handle);
        var s = (__opts.xRotation) ? $handle.width() : $handle.height();
        var pers = s * __opts.handlePersMult;
        var depth = s / 2 / Math.tan(angle / 2 * Math.PI/180);

        $slider.addClass("with-controls");
        $handle.css({"-webkit-perspective": pers + "px",
                     "perspective": pers + "px"})
          .addClass("js-handle");
        $handleInner.css("transform", "translateZ(-"+ depth +"px)");

        if (__opts.xRotation) $controls.addClass("m--xAxis");

        $handleItems.each(function(index) {
          $(this).css("transform", "rotate"+axis+"("+ (index * angle * angleMult) +"deg) translateZ("+ depth +"px)");
        });

        $rotaters = $(prefix + "rotater, "+ handlePrefix + "rotater", $slider);

        $handle.on("mousedown touchstart", dragRotationHandler);

        $(document).on("click", ".slider3d__control", function() {
          if (rotating && !__opts.allowControlsDuringAnim) return;
          rotating = true;
          if ($(this).hasClass("m--up")) {
            navigateUp();
          } else {
            navigateDown();
          }
        });
      };

      function initSlider($el) {
        $slider = $el;
        var $wrapper = $(prefix + "wrapper", $slider);
        var $inner = $(prefix + "inner", $slider);
        var $items = $(prefix + "item", $slider);
        numOfItems = $items.length;
        angle = 360 / numOfItems;
        var s = (__opts.xRotation) ? $slider.width() : $slider.height();
        var pers = s * __opts.persMult;
        var depth = s / 2 / Math.tan(angle / 2 * Math.PI/180);

        $wrapper.css({"-webkit-perspective": pers + "px",
                      "perspective": pers + "px"});
        $inner.css("transform", "translateZ(-"+ depth +"px)");

        $items.each(function(index) {
          $(this).css("transform", "rotate"+axis+"("+ (index * angle * angleMult) +"deg) translateZ("+ depth +"px)");
        });

        $slider.addClass("slider-ready");

        $rotaters = $(prefix + "rotater", $slider);

        if (__opts.scrollRotation) {
          $slider.on("mousewheel DOMMouseScroll", scrollHandler);
        }
      };

      initSlider($el);

    }

    function globalInit() {
      $(selector).each(function() {
        initSingleSlider($(this), options);
      });
    };

    function debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };

    var resizeFn = debounce(function() {
      globalInit();
    }, 100);

    $(window).on("resize", resizeFn);

    globalInit();

  };

  window.rotatingSlider = rotatingSlider;
}());

$(document).ready(function() {

  rotatingSlider(".slider3d", {xRotation: false, globalDragRotation: false});

  $(window).resize();

});
