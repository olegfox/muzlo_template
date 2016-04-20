'use strict';

/**
 * @ngdoc function
 * @name muzloTemplateApp.controller:PlayerCtrl
 * @description
 * # MainCtrl
 * Controller of the muzloTemplateApp
 */
angular.module('muzloTemplateApp')
  .controller('LoginCtrl', function ($scope, $http, AudioService, AudioServiceAd) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    jQuery('.wrap-header').each(function(i, e) {
      if(jQuery(e).attr('data-video') != undefined) {
        if(jQuery(e).data('video').length > 0) {
          jQuery(e).vide({
            mp4: jQuery(e).data('video')
          }, {
            volume: 1,
            playbackRate: 1,
            muted: true,
            autoplay: true,
            loop: true,
            position: '50% 50%', // Similar to the CSS `background-position` property.
            posterType: 'detect', // Poster image type. "detect" — auto-detection; "none" — no poster; "jpg", "png", "gif",... - extensions.
            resizing: true // Auto-resizing, read: https://github.com/VodkaBears/Vide#resizing...
          });
        }
      }
    });

    $(".arrow").each(function(i, el) {
      if($(el).data('current-level')) {
        $(el).click(function(e){
          console.log($(el).data('current-level'));
          e.preventDefault();
          $("html, body").animate({scrollTop: $("." + $(el).data('current-level')).nextAll('.level-block').first().offset().top}, 1000);
        });
      }
    });

    $(".hint-right").each(function(i, el) {
      if($(el).data('current-level')) {
        $(el).click(function(e){
          console.log($(el).data('current-level'));
          e.preventDefault();
          $("html, body").animate({scrollTop: $("." + $(el).data('current-level')).offset().top}, 1000);
        });
      }
    });

    var wow = new WOW(
      {
        boxClass: 'wow',      // animated element css class (default is wow)
        animateClass: 'animated', // animation css class (default is animated)
        offset: 0,          // distance to the element when triggering the animation (default is 0)
        mobile: true,       // trigger animations on mobile devices (default is true)
        live: true        // act on asynchronously loaded content (default is true),
      }
    );
    wow.init();

    $(window).scroll(function() {
      console.log('window scrollTop = ' + $(this).scrollTop());
      if($(this).scrollTop() > $('.level74').offset().top + $('html').height() || $(this).scrollTop() < $('.level74').offset().top - $('html').height() / 2) {
          console.log('hide wow');
          $('.cloud_women').css({
              'visibility' : 'hidden',
              'animation-name' : 'none'
          }).removeClass('animated');   
          $('.women').css({
              'visibility' : 'hidden',
              'animation-name' : 'none'
          }).removeClass('animated');   
      } else {
          console.log('show wow'); 
          $('.cloud_women').removeAttr('style').addClass('animated'); 

          setTimeout(function() {
              $('.women').removeAttr('style').addClass('animated'); 
          }, 1000);  
      } 

    });

  });
