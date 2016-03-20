'use strict';

/**
 * @ngdoc function
 * @name muzloTemplateApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the muzloTemplateApp
 */
angular.module('muzloTemplateApp')
  .controller('MainCtrl', function ($scope, $http, AudioService, AudioServiceAd) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var videobackground = new $.backgroundVideo($('.block-1'), {
      "align": "centerXY",
      "path": "images/",
      "filename": "web_one",
      "types": ["mp4"],
      "preload": true,
      "autoplay": true,
      "loop": true
    });

  });
