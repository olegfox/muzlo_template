'use strict';

/**
 * @ngdoc function
 * @name muzloTemplateApp.controller:PlayerCtrl
 * @description
 * # MainCtrl
 * Controller of the muzloTemplateApp
 */
angular.module('muzloTemplateApp')
  .factory('AudioService', function () {
    "use strict";

    var params = {
      swf_path: 'bower_components/audio5/swf/audio5js.swf',
      throw_errors: true,
      format_time: true
    };

    var audio5js = new Audio5js(params);

    return audio5js;
  })
  .controller('PlayerCtrl', function ($scope, $http, AudioService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $http.get('/music/Шаблон 1/playlist.json')
      .then(function(response){

        // Шаблон
        $scope.pattern = response.data[0];

        // Плейлисты
        $scope.patterns_dirs = $scope.pattern.patterns_dirs;

        // Сервис для работы с аудио
        $scope.player = AudioService;

        // Текущий плейлист
        $scope.patterns_dir = $scope.patterns_dirs[0];
        // Текущий трек
        $scope.numberTrack = 0;

        // Определение мобильного устройства
        var isMobile = {
          Android: function () {
            return navigator.userAgent.match(/Android/i);
          },
          BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
          },
          iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
          },
          Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
          },
          Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
          },
          any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
          }
        };

        // Проверка вхождения плейлиста во временной диапазон
        $scope.checkPlaylistTime = function (playlist) {
          
          return false;
        };

        // Поиск плейлиста по текущему времени
        $scope.findPlaylistTime = function () {
          
          return false;
        };

        // Сброс
        $scope.reset = function () {
          $scope.shuffle();
          loadMusic($scope.patterns_dir);
        };

        // Стоп
        $scope.stop = function () {
          $scope.player.pause();
        };

        // Загрузка трека
        var loadMusic = function (pl) {

          $scope.player.load(pl.music_files[$scope.numberTrack].file_name);

          pl.selected = 1;
          $scope.player.play();

          // Обновление времени проигрывания трека
          $scope.player.on('timeupdate', function (position, duration) {
            $scope.debug(position, duration);
          });

          // Debug
          $scope.debug = function (position, duration) {
            var time_start = new Date($scope.patterns_dir.time_start*1000),
                time_end = new Date($scope.patterns_dir.time_end*1000);

            time_start = time_start.getHours() + ":" + time_start.getMinutes();
            time_end = time_end.getHours() + ":" + time_end.getMinutes();

            $('.debug')
              .empty()
              .append("Название шаблона: " + $scope.pattern.title + "<br/>" +
                      "Название плейлиста: " + $scope.patterns_dir.title + "<br/>" +
                      "Время начала: " + time_start + "<br/>" +
                      "Время окончания: " + time_end + "<br/>" +
                      "Название трека: " + $scope.patterns_dir.music_files[$scope.numberTrack].title + "<br/>" +
                      "Исполнитель: " + $scope.patterns_dir.music_files[$scope.numberTrack].owner + "<br/>" +
                      "Жанр: " + $scope.patterns_dir.music_files[$scope.numberTrack].genre + "<br/>" +
                      "Путь к файлу: " + $scope.patterns_dir.music_files[$scope.numberTrack].file_name + "<br/>" +
                      "Продолжительность: " + moment.duration(duration, "seconds").format("mm:ss") + "<br/>" +
                      "Время: " + position);
          };

          // Следующий трек в плейлисте
          $scope.playNext = function () {
            $scope.numberTrack++;

            // Если треки в плейлисте закончились начинаем играть с первого
            if ($scope.numberTrack >= $scope.patterns_dir.music_files.length) {
              $scope.numberTrack = 0;
            }

            loadMusic($scope.patterns_dir);
          };

          // Окончание проигрывания трека и переключение на следующий трек
          $scope.player.on('ended', function () {
            setTimeout(function () {
              $scope.playNext();
            }, 1000);
          });
        }

        // Перемешивание треков в плейлисте
        $scope.shuffle = function () {
          var shuffleArray = function(array) {
            var m = array.length, t, i;

            // While there remain elements to shuffle
            while (m) {
              // Pick a remaining element…
              i = Math.floor(Math.random() * m--);

              // And swap it with the current element.
              t = array[m];
              array[m] = array[i];
              array[i] = t;
            }

            return array;
          }

          $scope.patterns_dir.music_files = shuffleArray($scope.patterns_dir.music_files);
        };

        // Плей
        $scope.play = function () {
          // Если плеер на паузе
          if($scope.player.position && !$scope.player.playing) {
            $scope.player.play();
          }
          // Если включается первый раз
          else if(!$scope.player.position) {
            $scope.reset();
          }

        };

        //if (!isMobile.iOS()) {
        //  $scope.playMusic($scope.currentPlaylist);
        //}
      });
  });
