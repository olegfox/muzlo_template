'use strict';

/**
 * @ngdoc overview
 * @name muzloTemplateApp
 * @description
 * # muzloTemplateApp
 *
 * Main module of the application.
 */
angular
  .module('muzloTemplateApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/player.html',
        controller: 'PlayerCtrl',
        controllerAs: 'player'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
